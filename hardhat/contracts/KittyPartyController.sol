// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./KittyPartyStateTransition.sol";
import './interfaces/IKittyPartyInit.sol';
import './interfaces/IKittyPartyWinnerStrategy.sol';
import "./interfaces/IKittyPartyYieldGenerator.sol";

/// @title Kitty Party Controller
contract KittyPartyController is KittyPartyStateTransition, IKittenPartyInit {
    bytes32 private inviteHash;
    uint constant MIN_KITTENS = 2;

    IKittyPartyWinnerStrategy kpWinnerSelectStrategy;

    KittyInitiator public kittyInitiator;
    KittyPartyFactoryArgs public kPFactory;
    KittyPartyControllerVars public kittyPartyControllerVars;

    IERC20 public dai;
    bytes public calldataForLock;
    bytes public callDataForUnwind;

    event RefundRequested(uint refund);
    event StopStaking(address party, uint amount);
    event PaidFees(address party, uint fees);
    event WinnersDecided(address party, uint[] winners);
    event PartyCompleted(address party, uint internalState);

    /****** MODIFIERS *******/

    modifier knownKitten(bytes32 _invitedHash) {
        require(inviteHash == _invitedHash);
        _;
    }

    modifier kittenExists(address _kitten) {
        bytes memory checkExistsKitten = abi.encodeWithSignature("checkExists(address,address)", address(this), msg.sender);
        (bool success, bytes memory returnData) = address(kPFactory.litterAddress).staticcall(checkExistsKitten);
        require(success, "NE");
        (bool exists) = abi.decode(returnData, (bool));
        require(exists == true, "NR");
        _;
    }

    modifier minimumKittens(uint numberOfKittens) {
        require(numberOfKittens >= MIN_KITTENS);
        _;
    }

    modifier onlyKreator(){
        require(msg.sender == kittyPartyControllerVars.kreator);
        _;
    }

    /****** STATE MUTATING FUNCTIONS *******/
    
    ///@dev initialize the contract after deploying
    function initialize(
        KittyInitiator calldata _kittyInitiator,
        KittyYieldArgs calldata _kittyYieldArgs,
        KittyPartyFactoryArgs calldata _kPFactory,
        address _kreator,
        uint256 _kreatorStake
    ) 
        public 
    {
        require(kittyPartyControllerVars.internalState == 0, "Already Initialized");
        kittyPartyControllerVars.internalState = 1;
        kittyInitiator = _kittyInitiator;
        kPFactory = _kPFactory;
        kittyPartyControllerVars.kreator = _kreator;
        kittyPartyControllerVars.kreatorStake = _kreatorStake;
        dai = IERC20(_kittyInitiator.daiAddress);
        kpWinnerSelectStrategy = IKittyPartyWinnerStrategy(kittyInitiator.winnerStrategy);

        IKittyPartyYieldGenerator(kittyInitiator.yieldContract).setPartyInfo(
            _kittyYieldArgs.sellTokenAddress,
            _kittyYieldArgs.lpTokenAddress);
        
        durationInDays = _kittyInitiator.durationInDays;
        _initState(_kittyInitiator.timeToCollection);
    }
    
    function setActivityInterval(uint8 _timeToCollection) external onlyKreator {
        timeToCollection = _timeToCollection;
    }

    function setInviteHash(bytes32 _inviteHash) external onlyKreator {
        inviteHash = _inviteHash;
    }

    function changeState() external onlyKreator returns (bool success) {
        _timedTransitions();
        return true;
    }

    ///@dev perform the actual value transfer and add Kitten to the party
    function depositAndAddKittenToParty(bytes32 _inviteHash) 
        external 
        knownKitten(_inviteHash)
        returns (bool)
    {
        _timedTransitions();
        _atStage(KittyPartyStages.InitialCollection);
        kittyPartyControllerVars.localKittens = kittyPartyControllerVars.localKittens + 1;

        require(kittyInitiator.maxKittens >= kittyPartyControllerVars.localKittens);
        require(msg.sender != kittyPartyControllerVars.kreator, "Kreator cannot join own party");
        require(numberOfRounds == 0, "Rounds were already initiated");
       
        bytes memory addKitten = abi.encodeWithSignature("addKitten(address)", msg.sender);
        (bool success,) = address(kPFactory.litterAddress).call(addKitten);
        require(success, "NK");
        
        depositForYield();
        IKittyPartyYieldGenerator(kittyInitiator.yieldContract).createLockedValue(calldataForLock);

        return true;
    }

    function setCallDataForYield(bytes memory _calldataForLock, bytes memory _callDataForUnwind) external onlyKreator {
        calldataForLock = _calldataForLock;
        callDataForUnwind = _callDataForUnwind;
    }

    ///@dev This function adds deposits for each round
    function addRoundDeposits() 
        external 
        kittenExists(msg.sender) 
        returns (bool)
    {        
        _timedTransitions();
        _atStage(KittyPartyStages.Collection);
        depositForYield();
        IKittyPartyYieldGenerator(kittyInitiator.yieldContract).createLockedValue(calldataForLock);
        return true;
    }

    function depositForYield()
        internal
    {
        uint256 daiBalance = dai.balanceOf(address(msg.sender)); 
        require(daiBalance >= kittyInitiator.amountInDAIPerRound, "Not enough balance");
        uint256 allowance = dai.allowance(msg.sender, address(this));
        require(allowance >= kittyInitiator.amountInDAIPerRound, "Please approve amount");
        require(dai.transferFrom(address(msg.sender), address(kittyInitiator.yieldContract), kittyInitiator.amountInDAIPerRound), 'Transfer Failed');
    }

    ///@dev This is called by the kreator once the kreator verifies that all the kittens have deposited initial amount for the first round.
    function applyInitialVerification() 
        external
        minimumKittens(kittyPartyControllerVars.localKittens)
    {
        //TODO: split this logic so that there is more flexibility, that is keep no of rounds separate from no of Kittens
        _timedTransitions();
        _atStage(KittyPartyStages.Staking);
        require(kittyPartyControllerVars.internalState == 1, "Rounds were already initiated");
        kittyPartyControllerVars.internalState = 2;

        if(kittyPartyControllerVars.kreatorStake >= kittyInitiator.amountInDAIPerRound * kittyInitiator.maxKittens) {
            //Multiple Rounds
            numberOfRounds = kittyPartyControllerVars.localKittens;
        } else {
            //only minimum stake so only single round
            numberOfRounds = 0;
        }
    }

    ///@dev Stop the staking and push the yield generated for the specific kitty party to the treasury
    function stopStaking() external {
        _timedTransitions();
        _atStage(KittyPartyStages.Payout);
        kpWinnerSelectStrategy.initiateCheckWinner(kittyPartyControllerVars.localKittens);
        IKittyPartyYieldGenerator(kittyInitiator.yieldContract).unwindLockedValue(callDataForUnwind);
        
        bytes memory yieldGenerated = abi.encodeWithSignature("yieldGenerated(address)",address(this));
        (bool successYield, bytes memory returnData) = address(kittyInitiator.yieldContract).staticcall(yieldGenerated);
        require(successYield, "YE1");
        (kittyPartyControllerVars.profit) = abi.decode(returnData, (uint256));
        emit StopStaking(address(this), kittyPartyControllerVars.profit);

    }

     /// @dev pay system and kreator fees
    function payOrganizerFees() external {
        _atStage(KittyPartyStages.Payout);
        require(kittyPartyControllerVars.profit > 0);
        uint256 amountToSendKreator = kittyPartyControllerVars.profit * kittyInitiator.kreatorFeesInBasisPoints / 10000;
        uint256 amountToSendDAO = kittyPartyControllerVars.profit * kittyInitiator.daoFeesInBasisPoints / 10000;
        kittyPartyControllerVars.profitToSplit = kittyPartyControllerVars.profit - (amountToSendKreator + amountToSendDAO);
        kittyPartyControllerVars.profit = 0;
        mintTokens(kittyPartyControllerVars.kreator, amountToSendKreator, 0);
        mintTokens(kPFactory.daoTreasuryContract, amountToSendDAO, 0);
        emit PaidFees(address(this), amountToSendKreator + amountToSendDAO);
    }

    ///@dev this is where the receipts are given to the winners to redeem the actual amount from the treasury contract
    function applyWinnerStrategy() external {
        _atStage(KittyPartyStages.Payout);
        require(kittyPartyControllerVars.profitToSplit > 0);

        uint amountToSend =  (kittyPartyControllerVars.profitToSplit 
                                / kpWinnerSelectStrategy.getLength());
        kittyPartyControllerVars.profitToSplit = 0;
        uint[] memory winners = kpWinnerSelectStrategy.getWinners();
        bytes memory payload = abi.encodeWithSignature(
            "mintToWinners(address,address,address,uint256[],uint256)",
            kittyPartyControllerVars.kreator,
            kPFactory.litterAddress,
            address(this), 
            winners, 
            amountToSend
        );

        (bool success,) = address(kPFactory.accountantContract).call(payload);
        require(success, "YE2");
        emit WinnersDecided(address(this), winners);
    }
    
    ///@dev This is to be called after party completion to mint the NFT's and tokens to the kittens and kreator
    function applyCompleteParty() external {
        _timedTransitions();
        _atStage(KittyPartyStages.Completed);
        require(kittyPartyControllerVars.internalState == 2);
        kittyPartyControllerVars.internalState = 3;
        bytes memory payload = abi.encodeWithSignature(
            "transferBadgesOnCompletion(address,address)", 
            kPFactory.litterAddress,
            address(this)
        );
        (bool success,) = address(kPFactory.accountantContract).call(payload);
        require(success);

        //Finally give the Kreator a kreator badge for completing the round and also return all the DAI tokens
        mintTokens(kittyPartyControllerVars.kreator, 1, 4);
        mintTokens(kittyPartyControllerVars.kreator, kittyPartyControllerVars.kreatorStake, 0);
        emit PartyCompleted(address(this), kittyPartyControllerVars.internalState);  
    }

    /// @dev mint receipt tokens via the Kitty Party Accountant, receipt tokens can be claimed from the treasury
    function mintTokens(
        address mintTo, 
        uint256 amount, 
        uint256 tokenType
    ) 
        private
    {
        require(mintTo != address(0));
        bytes memory payload = abi.encodeWithSignature(
            "mint(address,uint256,uint256,bytes)", 
            mintTo, 
            tokenType, 
            amount, 
            ""
        );
        // for kittyPartyControllerVars.profit to be calculated we need to unwind the position succesfuly the kittyPartyControllerVarsprofit - X% to kreator and Y% to contract becomes the winning
        (bool success,) = address(kPFactory.accountantContract).call(payload);
        require(success);
    }

    /// @dev if the MIN_KITTENS have not joined in time, the kreator can seek refund before the internal state changes to party started
    function checkRefund() 
        external
        onlyKreator
    {
        require(kittyPartyControllerVars.localKittens < MIN_KITTENS, "No refund possible");
        require(kittyPartyControllerVars.internalState == 1, "No refund possible"); //as long as verification was not done
        kittyPartyControllerVars.internalState = 3; // set the party as finished
        _nextStage(5);

        if(kittyPartyControllerVars.localKittens > 0) {
            uint refund = kittyPartyControllerVars.localKittens * kittyInitiator.amountInDAIPerRound;
            IKittyPartyYieldGenerator(kittyInitiator.yieldContract).unwindLockedValue(callDataForUnwind);
            mintTokens(kittyPartyControllerVars.kreator, refund, 0);
            emit RefundRequested(refund);
        }
        mintTokens(kittyPartyControllerVars.kreator, kittyPartyControllerVars.kreatorStake, 0);   
    }
}

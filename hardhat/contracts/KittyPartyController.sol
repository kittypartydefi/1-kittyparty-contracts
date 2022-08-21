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
    uint256[] public partyRoundKittens;
    uint8 public round = 0;

    IKittyPartyWinnerStrategy kpWinnerSelectStrategy;

    KittyInitiator public kittyInitiator;
    KittyPartyFactoryArgs public kPFactory;
    KittyPartyControllerVars public kittyPartyControllerVars;

    IERC20 public dai;
    bytes public calldataForLock;
    bytes public callDataForUnwind;

    /****** EVENTS *******/

    event KreatorStaked(uint amount);
    event KittenDeposited(uint amount);
    event RefundRequested(uint refund);
    event StopStaking(address party, uint amount);
    event PaidFees(address party, uint fees);
    event WinnersDecided(address party, uint[] winners);
    event PartyCompleted(address party, uint internalState);

    /****** MODIFIERS *******/

    modifier knownKitten(bytes32 _invitedHash) {
        require(inviteHash == _invitedHash, "BI");
        _;
    }

    modifier minimumKittens(uint numberOfKittens) {
        require(numberOfKittens >= MIN_KITTENS, "MK");
        _;
    }

    modifier onlyKreator(){
        require(msg.sender == kittyPartyControllerVars.kreator, "NK");
        _;
    }

    modifier onlyKreatorOrKitten(){
        require(msg.sender == kittyPartyControllerVars.kreator || _kittenExists(), "KK");
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
        emit KreatorStaked(_kreatorStake);
        _initState(_kittyInitiator.timeToCollection);
    }
    
    function setActivityInterval(uint8 _timeToCollection) external onlyKreator {
        timeToCollection = _timeToCollection;
    }

    function setInviteHash(bytes32 _inviteHash) external onlyKreator {
        inviteHash = _inviteHash;
    }

    ///@dev Calling this can change the state without checking conditions!!! Use cautiously!
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
        require(success, "Kitten not added");
        
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
        returns (bool)
    {        
        if(_kittenExists()) {
            _timedTransitions();
            _atStage(KittyPartyStages.Collection);
            depositForYield();
            IKittyPartyYieldGenerator(kittyInitiator.yieldContract).createLockedValue(calldataForLock);
            return true;
        }
        else
            return false;

    }

    function depositForYield()
        internal
    {
        uint256 daiBalance = dai.balanceOf(address(msg.sender)); 
        require(daiBalance >= kittyInitiator.amountInDAIPerRound, "Not enough balance");
        uint256 allowance = dai.allowance(msg.sender, address(this));
        require(allowance >= kittyInitiator.amountInDAIPerRound, "Please approve amount");
        require(dai.transferFrom(address(msg.sender), address(kittyInitiator.yieldContract), kittyInitiator.amountInDAIPerRound), 'Transfer Failed');
        
        bytes memory getIndex = abi.encodeWithSignature("getIndex(address,address)",address(this),msg.sender);
        (bool success, bytes memory kittenIndex) = address(kPFactory.litterAddress).call(getIndex);
        require(success, "Kitten not added");
        (uint256 index) = abi.decode(kittenIndex, (uint256));
        emit KittenDeposited(kittyInitiator.amountInDAIPerRound);
        partyRoundKittens.push(index);
    }

    ///@dev This is called by the kreator once the kreator verifies that all the kittens have deposited initial amount for the first round.
    function applyInitialVerification() 
        external
        minimumKittens(kittyPartyControllerVars.localKittens)
    {
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

    ///@dev This is used for changing state from Collection -> Staking
    function startStakingMultiRound() external {
        _atStage(KittyPartyStages.Collection);
        require(partyRoundKittens.length == kittyPartyControllerVars.localKittens, "Kitten Missing!");
        _timedTransitions();
        _atStage(KittyPartyStages.Staking);
    }

    ///@dev This is used for changing state from Payout -> Collection for multiRound
    function startNextRound() external {
        _atStage(KittyPartyStages.Payout);
        _timedTransitions();
        _atStage(KittyPartyStages.Collection);
        round++;
    }


    ///@dev Stop the staking and push the yield generated for the specific kitty party to the treasury
    function stopStaking() external {
        _timedTransitions();
        _atStage(KittyPartyStages.Payout);
        
        IKittyPartyYieldGenerator(kittyInitiator.yieldContract).unwindLockedValue(callDataForUnwind);
        
        bytes memory yieldGenerated = abi.encodeWithSignature("yieldGenerated(address)",address(this));
        (bool successYield, bytes memory returnData) = address(kittyInitiator.yieldContract).staticcall(yieldGenerated);
        require(successYield, "YE1");
        (kittyPartyControllerVars.yieldWithPrincipal) = abi.decode(returnData, (uint256));
        kittyPartyControllerVars.profit = kittyPartyControllerVars.yieldWithPrincipal - kittyInitiator.amountInDAIPerRound * kittyPartyControllerVars.localKittens;
        emit StopStaking(address(this), kittyPartyControllerVars.profit);
    }

     /// @dev pay system and kreator fees
    function payOrganizerFees() external {
        _atStage(KittyPartyStages.Payout);
        require(kittyPartyControllerVars.profit > 0);
        uint256 amountToSendKreator = kittyPartyControllerVars.profit * kittyInitiator.kreatorFeesInBasisPoints / 10000;
        uint256 amountToSendDAO = kittyPartyControllerVars.profit * kittyInitiator.daoFeesInBasisPoints / 10000;
        kittyPartyControllerVars.profitToSplit = kittyPartyControllerVars.yieldWithPrincipal - (amountToSendKreator + amountToSendDAO);
        kittyPartyControllerVars.profit = 0;
        kpWinnerSelectStrategy.initiateCheckWinner(kittyPartyControllerVars.localKittens, kittyPartyControllerVars.profitToSplit);
        mintTokens(kittyPartyControllerVars.kreator, amountToSendKreator, 0);
        mintTokens(kPFactory.daoTreasuryContract, amountToSendDAO, 0);
        emit PaidFees(address(this), amountToSendKreator + amountToSendDAO);
    }

    ///@notice send KPR to the winners to redeem the actual amount from the treasury contract
    function applyWinnerStrategy() external {
        _atStage(KittyPartyStages.Payout);
        require(kittyPartyControllerVars.profitToSplit > 0);

        kittyPartyControllerVars.profitToSplit = 0;
        uint[] memory winners = kpWinnerSelectStrategy.getWinners();
        uint[] memory winnerAmounts = kpWinnerSelectStrategy.getWinAmounts();
        batchMintReceiptTokens(winners, winnerAmounts);
        delete partyRoundKittens;//clear the current round participants
        emit WinnersDecided(address(this), winners);
    }
    
    ///@notice This is to be called after party completion to mint the NFT's and tokens to the kittens and kreator
    function applyCompleteParty() external {
        _timedTransitions();
        _atStage(KittyPartyStages.Completed);
        require(kittyPartyControllerVars.internalState == 2);
        kittyPartyControllerVars.internalState = 3;
        //Finally give the Kreator a kreator badge for completing the round and also return all the DAI tokens
        mintTokens(kittyPartyControllerVars.kreator, 1, 4);
        mintTokens(kittyPartyControllerVars.kreator, kittyPartyControllerVars.kreatorStake, 0);
        emit PartyCompleted(address(this), kittyPartyControllerVars.internalState);  
    }

    /**
    *@dev if the MIN_KITTENS have not joined in time, the kreator or kittens 
    *@dev can seek refund as long as we are not in payout/completed or the party is not finished
    *@dev kittens are allowed as well since the kreator might not be incentivised to loose his funds
    */ 
    function issueRefund() 
        external
        onlyKreatorOrKitten
    {
        require(stage != KittyPartyStages.Payout, "Cannot refund in payout");
        require(stage != KittyPartyStages.Completed, "Cannot refund in Completed");
        require(kittyPartyControllerVars.internalState  != 3, "Cannot refund");
        kittyPartyControllerVars.internalState = 3; // set the party as finished
        _nextStage(5);
        uint kreatorRefundedAmount = 0;

        if(kittyPartyControllerVars.localKittens > 0) {
            //here we need to call a disband strategy based on the type of strategy
            //TODO the strategy needs to know how calculate who were the previous winners and who needs to be refunded
            uint totalRefundValue = IKittyPartyYieldGenerator(kittyInitiator.yieldContract).unwindLockedValue(callDataForUnwind);
            // the unwind should return how much was unwinded 
            uint[] memory refundAddresses = new uint[](kittyPartyControllerVars.localKittens);
            uint[] memory refundAmounts = new uint[](kittyPartyControllerVars.localKittens);
            if(round > 0){
                (, refundAmounts) = kpWinnerSelectStrategy.disbandStrategy(partyRoundKittens, kittyPartyControllerVars.kreatorStake);                
            }
            else{
                for (uint256 i = 0; i < kittyPartyControllerVars.localKittens; i++) {
                    refundAmounts[i] = kittyInitiator.amountInDAIPerRound;
                }
            }
            batchMintReceiptTokens(partyRoundKittens, refundAmounts);
            //call the strategy here, pass in the total unwindedLockedValue 
            delete partyRoundKittens;//clear the current round participants
        }
        if(round == 0) {
            //if round is zero the kreator can get his stake back since there was no winner
            mintTokens(kittyPartyControllerVars.kreator, kittyPartyControllerVars.kreatorStake, 0);
            kreatorRefundedAmount = kittyPartyControllerVars.kreatorStake;
            mintTokens(kittyPartyControllerVars.kreator, kreatorRefundedAmount, 0);
            emit RefundRequested(kittyPartyControllerVars.kreatorStake);
        }
        else{//it can be assumed here that there are more than 1 kittens

        }
    }

    /**
    *@dev check if a kitten exists
    */
    function _kittenExists() internal returns (bool) {
        bytes memory checkExistsKitten = abi.encodeWithSignature("checkExists(address,address)", address(this), msg.sender);
        (bool success, bytes memory returnData) = address(kPFactory.litterAddress).staticcall(checkExistsKitten);
        require(success, "NE");
        (bool exists) = abi.decode(returnData, (bool));
        return(exists);
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
        // for kittyPartyControllerVars.profit to be calculated we need to unwind the position succesfuly 
        // the kittyPartyControllerVarsprofit - X% to kreator and Y% to contract becomes the winning
        (bool success,) = address(kPFactory.accountantContract).call(payload);
        require(success);
    }

    function batchMintReceiptTokens(
        uint256[] memory kittenIndexes,
        uint256[] memory amountToSend
    )
        private
    {
        bytes memory payload = abi.encodeWithSignature(
            "mintToKittens(address,address,uint256[],uint256[])",
            kPFactory.litterAddress,
            address(this), 
            kittenIndexes, 
            amountToSend
        );

        (bool success,) = address(kPFactory.accountantContract).call(payload);
        require(success, "Batch receipt failed");
    }
}

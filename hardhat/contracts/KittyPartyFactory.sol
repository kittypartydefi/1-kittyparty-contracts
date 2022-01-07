// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import './KittyPartyController.sol';
import './interfaces/IKittyPartyInit.sol';
import './interfaces/IKittyPartyAccountant.sol';
import './interfaces/IKittyPartyKeeper.sol';

contract KittyPartyFactory is IKittenPartyInit, Initializable {

    KittyPartyFactoryArgs public kpFactory;

    mapping(address => address[]) public myKitties;
    mapping(address => bool) public myStrategies;

    uint8 public kreatorFeesInBasisPoints;
    uint8 public daoFeesInBasisPoints;
    address public daoAddress;

    uint256 constant DECIMALS = 10 ** 18;
    
    event KittyLive(address indexed kreator, address kitty, bytes32 kittyPartyName);
    event FactoryInitialized();
    
    modifier onlyDAOAddress(){
        require(msg.sender == daoAddress);
        _;
    }

    function initialize(address _daoAddress) external initializer {
        daoAddress = _daoAddress;
        kreatorFeesInBasisPoints = 100;
        daoFeesInBasisPoints = 100;
    }

    function setFactoryInit(KittyPartyFactoryArgs memory _kpFactory) external onlyDAOAddress {
        kpFactory = _kpFactory;
        emit FactoryInitialized();
    }
    
    function setKreatorFees(uint8 _kreatorFeesInBasisPoints) external onlyDAOAddress {
        kreatorFeesInBasisPoints = _kreatorFeesInBasisPoints;
    }

    function setApprovedStrategy(address _strategy) external onlyDAOAddress {
        myStrategies[_strategy] = true;
    }

    function setDAOFees(uint8 _daoFeesInBasisPoints) external onlyDAOAddress {
        daoFeesInBasisPoints = _daoFeesInBasisPoints;
    }
    
    /// @dev A factory that creates a Kitty Party, any user can create a PLANETARY factory
    /// @notice Kitty Party is a community not a single pool so limit no of Kittens/pool
    function createKitty(
         KittyInitiator calldata _kittyInitiator,
         KittyYieldArgs calldata _kittyYieldArgs
    )
        external
        returns (address kittyAddress)
    {
        address kitty = ClonesUpgradeable.clone(kpFactory.tomCatContract);   
        IERC20 dai = IERC20(_kittyInitiator.daiAddress);
        uint256 allowance = dai.allowance(msg.sender, address(this));
        uint badgeType = (_kittyInitiator.amountInDAIPerRound >= 1000000 * DECIMALS) ? 3 : 
                    (_kittyInitiator.amountInDAIPerRound >= 1000 * DECIMALS) ? 2 : 1;
    
        require(myStrategies[_kittyInitiator.yieldContract] == true, "Strategy not approved");
        //min requirements to be met
        require(_kittyInitiator.maxKittens <= 20, "Too many Kittens");
        require(allowance >= _kittyInitiator.amountInDAIPerRound / 10, "Min 10% req as stake");
        require(_kittyInitiator.amountInDAIPerRound >= 20 * DECIMALS, "Min $20 req as stake");
        require(dai.transferFrom(msg.sender, address(_kittyInitiator.yieldContract), allowance), "Kreator stake fail");
        require(_kittyInitiator.kreatorFeesInBasisPoints <= kreatorFeesInBasisPoints, "Fees too low");
        require(_kittyInitiator.daoFeesInBasisPoints <= daoFeesInBasisPoints, "Dao fees too low");
        //check kreators permissions        
        require(IKittyPartyAccountant(kpFactory.accountantContract).balanceOf(msg.sender, badgeType) > 0, "Kreator not permitted");
        require(IKittyPartyAccountant(kpFactory.accountantContract).balanceOf(msg.sender, 5) == 0, "HARKONNEN");
        require(IKittyPartyAccountant(kpFactory.accountantContract).setupMinter(kitty), "Not able to set minter");
   
        KittyPartyController(kitty).initialize(
            _kittyInitiator,
            _kittyYieldArgs,
            kpFactory,
            msg.sender, 
            allowance
        );

        //Add the created factory to the active kitty party list
        myKitties[msg.sender].push(kitty);
        emit KittyLive(msg.sender, kitty, _kittyInitiator.partyName);

        (bool successLitter,) = address(kpFactory.litterAddress).call(abi.encodeWithSignature("setupKittyParty(address)", kitty));
        require(successLitter, "Not able to set KittyParty role!");
        //automate the cron jobs via keepers
        IKittyPartyKeeper(kpFactory.keeperContractAddress).addKPController(kitty);
        
        return kitty;
    }
     
    function getMyKitties(address candidateAddress) external view returns (address[] memory) {
        return myKitties[candidateAddress];
    }    
}
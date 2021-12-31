// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Receiver.sol";

import './KittyPartyController.sol';
import './interfaces/IKittyPartyInit.sol';

contract KittyPartyFactory is IKittenPartyInit, IERC1155Receiver {

    KittyPartyFactoryArgs public kPFactory;

    mapping(address => address[]) public myKitties;

    bool public shouldReject;

    bytes public lastData;
    address public lastOperator;
    address public lastFrom;
    uint256 public lastId;
    uint256 public lastValue;

    uint8 public kreatorFeesInBasisPoints = 100;
    uint8 public daoFeesInBasisPoints = 100;
   
    bytes4 constant internal ERC1155_ACCEPTED = 0xf23a6e61;
    bytes4 constant internal ERC1155_BATCH_ACCEPTED = 0xbc197c81;

    event KittyLive(address indexed kreator, address kitty, bytes32 kittyPartyName);
    
    modifier onlyDAOAddress(){
        require(msg.sender == kPFactory.daoAddress);
        _;
    }

    constructor(
        KittyPartyFactoryArgs memory _kPFactory
    )   {
        kPFactory = _kPFactory;
    }

    function setFactoryInits(KittyPartyFactoryArgs memory _kPFactory) external onlyDAOAddress {
        kPFactory = _kPFactory;
    }
    
    function setKreatorFees(uint8 _kreatorFeesInBasisPoints) external onlyDAOAddress {
        kreatorFeesInBasisPoints = _kreatorFeesInBasisPoints;
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
        address kitty = ClonesUpgradeable.clone(kPFactory.tomCatContract);
        (bool success,) = address(kPFactory.accountantContract).call(abi.encodeWithSignature("setupMinter(address)", kitty));
        require(success, "Not able to set minter");
        require(_kittyInitiator.maxKittens <= 20, "Too many Kittens");
        
        IERC20 dai = IERC20(_kittyInitiator.daiAddress);
        uint256 allowance = dai.allowance(msg.sender, address(this));

        //require minimum stake from kreator
        require(allowance >= _kittyInitiator.amountInDAIPerRound / 10, "Min 10% req as Stake");
        require(_kittyInitiator.amountInDAIPerRound >= 20 * 10 ** 18, "Min $20 req as Stake");
        require(dai.transferFrom(msg.sender, address(_kittyInitiator.yieldContract), allowance), "Kreator stake fail");
        require(_kittyInitiator.kreatorFeesInBasisPoints <= kreatorFeesInBasisPoints);// you cannot charge more fees than guidance
        require(_kittyInitiator.daoFeesInBasisPoints <= daoFeesInBasisPoints);
        
        KittyPartyController(kitty).initialize(
            _kittyInitiator,
            _kittyYieldArgs,
            kPFactory,
            msg.sender, 
            allowance
        );

        //Add the created factory to the active kitty party list
        myKitties[msg.sender].push(kitty);
        emit KittyLive(msg.sender, kitty, _kittyInitiator.partyName);

        (bool successLitter,) = address(kPFactory.litterAddress).call(abi.encodeWithSignature("setupKittyParty(address)", kitty));
        require(successLitter, "Not able to set KittyParty role!");
        
        return kitty;
    }
     
    function getMyKitties(address candidateAddress) external view returns (address[] memory) {
        return myKitties[candidateAddress];
    }

    function setShouldReject(bool _value) public {
        shouldReject = _value;
    }

    function onERC1155Received(
        address _operator, 
        address _from, 
        uint256 _id, 
        uint256 _value, 
        bytes calldata _data
    ) 
        external 
        override
        returns (bytes4) 
    {
        lastOperator = _operator;
        lastFrom = _from;
        lastId = _id;
        lastValue = _value;
        lastData = _data;
        if (shouldReject == true) {
            revert("onERC1155Received: transfer not accepted");
        } else {
            return ERC1155_ACCEPTED;
        }
    }

    function onERC1155BatchReceived(
        address _operator, 
        address _from, 
        uint256[] calldata _ids, 
        uint256[] calldata _values, 
        bytes calldata _data
    ) 
        external 
        override
        returns (bytes4) 
    {
        lastOperator = _operator;
        lastFrom = _from;
        lastId = _ids[0];
        lastValue = _values[0];
        lastData = _data;
        if (shouldReject == true) {
            revert("onERC1155BatchReceived: transfer not accepted");
        } else {
            return ERC1155_BATCH_ACCEPTED;
        }
    }

    // ERC165 interface support
    function supportsInterface(bytes4 interfaceID) 
        external 
        pure 
        override 
        returns (bool) 
    {
        return  interfaceID == 0x01ffc9a7 ||    // ERC165
                interfaceID == 0x4e2312e0;      // ERC1155_ACCEPTED ^ ERC1155_BATCH_ACCEPTED;
    }


    
}
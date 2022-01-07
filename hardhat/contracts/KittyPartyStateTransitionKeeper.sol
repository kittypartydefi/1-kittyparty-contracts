// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import './interfaces/IKeeper.sol';

/// @title Kitty Party State Transition Keeper
contract KittyPartyStateTransitionKeeper is KeeperCompatibleInterface, AccessControl {

    //Array to store addresses of currently active kitty parties
    address[] public kpControllers;

    //Mapping to identify the current intermediate stage of the party within the Payout Stage
    // 0 - Stop Staking
    // 1 - Pay Organizer Fees
    // 2 - Apply Winner Strategy
    mapping(address => uint8) kpControllerPayoutStage;

    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(SETTER_ROLE, msg.sender);
    }
    
    ///@dev This function is used to add the address of a new party to the array of kitty party addresses 
    function addKPController(address kpController) external onlyRole(SETTER_ROLE) {
        kpControllers.push(kpController);
    }

    function removeKPController(uint256 index) external onlyRole(SETTER_ROLE) {
        kpControllers[index] = kpControllers[kpControllers.length - 1];
        delete kpControllers[kpControllers.length - 1];
    }
    
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        uint numberOfParties = kpControllers.length;
        upkeepNeeded = false;

        for (uint i = 0; i < numberOfParties; i++) {
            address kpController = kpControllers[i];
            bytes memory payload = abi.encodeWithSignature("isTransitionRequired()");
            (bool success, bytes memory returnData) = address(kpController).staticcall(payload);
            require(success);
            (uint8 transitionType) = abi.decode(returnData, (uint8));
            
            //Transition is required only if transitionType is not equal to 88
            if (transitionType != 88 || kpControllerPayoutStage[kpController]!=0) {
                upkeepNeeded = true;
                bytes memory transitionData = abi.encode(transitionType, kpController);
                return (upkeepNeeded, transitionData);
            }           
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        (uint8 transitionType, address kpController) = abi.decode(performData, (uint8, address));
        bytes memory payload;
        if (transitionType == 0) {
            payload = abi.encodeWithSignature("applyInitialVerification()");            
        } else if (transitionType == 1) {
            payload = abi.encodeWithSignature("startStakingMultiRound()");
        } else if (transitionType == 2) {
            payload = abi.encodeWithSignature("stopStaking()");
            kpControllerPayoutStage[kpController] = 1;
        } else if (transitionType == 88 && kpControllerPayoutStage[kpController]!=0) {  
            if (kpControllerPayoutStage[kpController] == 1) {
                payload = abi.encodeWithSignature("payOrganizerFees()");
                kpControllerPayoutStage[kpController] = 2;
            } else if (kpControllerPayoutStage[kpController] == 2) {
                payload = abi.encodeWithSignature("applyWinnerStrategy()");
                kpControllerPayoutStage[kpController] = 0;
            }
        } else if (transitionType == 3) {
            payload = abi.encodeWithSignature("startNextRound()");           
        } else if (transitionType == 4) {
            payload = abi.encodeWithSignature("applyCompleteParty()");           
        }
        (bool success,) = address(kpController).call(payload);
        require(success);
    }
}
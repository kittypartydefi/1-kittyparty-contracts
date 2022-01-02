// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

/// @title Kitty Party State Transition Keeper
contract KittyPartyStateTransitionKeeper is KeeperCompatibleInterface, AccessControl {

    //Array to store addresses of currently active kitty parties
    address[] kpControllers;

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
    
    function checkUpkeep(bytes calldata checkData) external override returns (bool upkeepNeeded, bytes memory performData) {
        uint numberOfParties = kpControllers.length;
        upkeepNeeded = false;

        for (uint i = 0; i < numberOfParties; ++i) {
            address kpController = kpControllers[i];
            bytes memory payload = abi.encodeWithSignature("isTransitionRequired()");
            (bool success, bytes memory returnData) = address(kpController).staticcall(payload);
            require(success);
            (uint8 transitionType) = abi.decode(returnData, (uint8));
            
            //Transition is required only if transitionType is not equal to 88
            if (transitionType != 88) {
                upkeepNeeded = true;
                bytes memory transitionData = abi.encode(transitionStage, kpController);
                return (upkeepNeeded, transitionData);
            }           
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        (uint8 transitionType, address kpController) = abi.decode(performData, (uint8, address));

        if (transitionType == 0) {
            bytes memory payload = abi.encodeWithSignature("applyInitialVerification()");
            (bool success,) = address(kpController).call(payload);
            require(success);

        } else if (transitionType == 1) {
            bytes memory payload = abi.encodeWithSignature("stopStaking()");
            (bool success,) = address(kpController).call(payload);
            require(success);
            kpControllerPayoutStage[kpController] = 1;

        } else if (transitionType == 3) {  
            if (kpControllerState[kpController] == 1) {
                bytes memory payload = abi.encodeWithSignature("payOrganizerFees()");
                (bool success,) = address(kpController).call(payload);
                require(success);
                kpControllerState[kpController] = 2;
            } else if (kpControllerState[kpController] == 2) {
                bytes memory payload = abi.encodeWithSignature("applyWinnerStrategy()");
                (bool success,) = address(kpController).call(payload);
                require(success);
                kpControllerState[kpController] = 0;
            }      

        } else if (transitionType == 3 && kpControllerState[kpController] == 0) {
            bytes memory payload = abi.encodeWithSignature("applyCompleteParty()");
            (bool success,) = address(kpController).call(payload);
            require(success);            
        }
    }
}
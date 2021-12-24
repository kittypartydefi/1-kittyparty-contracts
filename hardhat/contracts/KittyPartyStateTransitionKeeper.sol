// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

contract KittyPartyStateTransitionKeeper is KeeperCompatibleInterface, AccessControl {
    address[] kpControllers;
    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    constructor() {
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(SETTER_ROLE, msg.sender);
    }

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
            (uint8 transitionStage) = abi.decode(returnData, (uint8));

            if (transitionStage != 88) {
                upkeepNeeded = true;
                bytes memory transitionData = abi.encode(transitionStage, kpController);
                return (upkeepNeeded, transitionData);
            }           
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        (uint8 transitionType, address kpController) = abi.decode(performData, (uint8, address));

        if (transitionType == 0 || transitionType == 1 || transitionType == 3) {
            bytes memory payload = abi.encodeWithSignature("changeState()");
            (bool success,) = address(kpController).call(payload);
            require(success);
        } else if (transitionType == 2) {
            bytes memory payload = abi.encodeWithSignature("applyWinnerStrategy()");
            (bool success,) = address(kpController).call(payload);
            require(success);            
        } else if (transitionType == 4) {
            bytes memory payload = abi.encodeWithSignature("applyCompleteParty()");
            (bool success,) = address(kpController).call(payload);
            require(success);            
        }
    }
}
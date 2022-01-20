// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface of the Kitty Party Accountant
 */

interface IKittyPartyAccountant {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function setupMinter(address kittyParty) external returns(bool); 
}
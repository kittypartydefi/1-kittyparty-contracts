// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

/**
 * @dev Interface of the Kitty Party Yield Generator
 */
interface IKittyPartyWinnerStrategy {
function initiateCheckWinner(uint _numberOfKittens) external;
function getWinners() external view returns (uint256[] memory);
function getWinnerAtLocation(uint i) external view returns (uint256);
function getLength() external view returns (uint);
}
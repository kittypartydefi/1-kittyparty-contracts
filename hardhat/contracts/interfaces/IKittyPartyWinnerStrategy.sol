// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface of the Kitty Party Yield Generator
 */
interface IKittyPartyWinnerStrategy {
function initiateCheckWinner(uint _numberOfKittens, uint _amountPerRound) external;
function disbandStrategy(uint256[] memory listOfKittensWhoPaidInThisRound, uint256 kreatorStake) external returns (uint256[] memory, uint256[] memory);
function getWinners() external view returns (uint256[] memory);
function getWinAmounts() external view returns (uint256[] memory);
function getWinnerAtLocation(uint i) external view returns (uint256);
function getLength() external view returns (uint);
}
// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "../base/KittyPartyWinnerSelectionOptions.sol";
import '../interfaces/IKittyPartyWinnerStrategy.sol';

contract KittyPartyWinnerDistributeEqual is KittyPartyWinnerSelectionOptions, IKittyPartyWinnerStrategy {

    uint256 numberOfKittens;

    uint256[] public winnerIndexes;
    uint256[] public prevWinnerIndexes;
    address kittens;

    bytes32 constant NULL = "";

    function initiateCheckWinner(uint _numberOfKittens) external override {
      //clear previous winners
      delete winnerIndexes;

      numberOfKittens = _numberOfKittens;
      for (uint i = 0; i < numberOfKittens; i++) {
          winnerIndexes.push(i);
      }
    }

    function getWinners() external view override returns (uint256[] memory)  {
        return winnerIndexes;
    }

    function getWinnerAtLocation(uint i) external view override returns (uint256){
        return winnerIndexes[i];
    }

    function getLength() external view override returns (uint) {
        return winnerIndexes.length;
    }
}

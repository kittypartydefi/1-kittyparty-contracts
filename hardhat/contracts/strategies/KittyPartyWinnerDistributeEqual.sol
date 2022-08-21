// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "../base/KittyPartyWinnerSelectionOptions.sol";
import '../interfaces/IKittyPartyWinnerStrategy.sol';

contract KittyPartyWinnerDistributeEqual is KittyPartyWinnerSelectionOptions, IKittyPartyWinnerStrategy {

    uint256 numberOfKittens;

    uint256[] public winnerIndexes;
    uint256[] public winnerAmounts;
    address kittens;

    bytes32 constant NULL = "";

    function initiateCheckWinner(uint _numberOfKittens, uint _profitToSplit) external {
      //clear previous winners
      delete winnerIndexes;

      numberOfKittens = _numberOfKittens;
      for (uint i = 0; i < numberOfKittens; i++) {
          winnerIndexes.push(i);
          winnerAmounts.push(_profitToSplit/numberOfKittens);
      }
    }

    function getWinners() external view returns (uint256[] memory)  {
        return winnerIndexes;
    }

    function getWinAmounts() external view returns (uint256[] memory)  {
        return winnerAmounts;
    }

    /**
    *@dev The strategy in case the kreator calls for disbanding
     */
    function disbandStrategy(uint256[] memory listOfKittensWhoPaidInThisRound, uint256 kreatorStake) external returns (uint256[] memory, uint256[] memory refundAmounts) {
        // split the kreators stake equally amongst the people who might be at a disadvantage
        uint256 stakeSplitPerHead = kreatorStake/listOfKittensWhoPaidInThisRound.length;
        refundAmounts = new uint256[](listOfKittensWhoPaidInThisRound.length); 
        for (uint i = 0; i < listOfKittensWhoPaidInThisRound.length; i++) {
            refundAmounts[listOfKittensWhoPaidInThisRound[i]] = winnerAmounts[listOfKittensWhoPaidInThisRound[i]]+stakeSplitPerHead;
        }
        
    }


    function getWinnerAtLocation(uint i) external view override returns (uint256){
        return winnerIndexes[i];
    }

    function getLength() external view override returns (uint) {
        return winnerIndexes.length;
    }
}

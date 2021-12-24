// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;


/// @title Kitty Party Types and options
/// @notice Utilized by factory while deciding what party to start
/// There are three parties 
contract KittyPartyWinnerSelectionOptions {
  enum WinningStrategy {
    Bid,
    DistributeEqual,
    SingleLosslessLotteryWinnerPerRound,
    SingleLotteryWinnerPerRound,
    MultipleLotteryWinnersPerRound
  }
  
  //default winning strategy
  WinningStrategy public winnerStrategy = WinningStrategy.SingleLosslessLotteryWinnerPerRound;
}
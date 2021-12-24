// SPDX-License-Identifier: BSL
pragma solidity ^0.8.2;

interface IKittenPartyInit {
    struct KittyInitiator { 
        uint8 kreatorFeesInBasisPoints;
        uint8 daoFeesInBasisPoints;
        uint8 winningStrategy;
        uint8 timeToCollection; 
        uint16 maxKittens;
        uint16 durationInDays;
        uint256 amountInDAIPerRound;
        bytes32 partyName;
        address daiAddress;
        address yieldContract; 
        address winnerStrategy; 
    }

    struct KittyYieldArgs {
        address sellTokenAddress;
        address lpTokenAddress;
    }
    
    struct KittyPartyFactoryArgs {
        address tomCatContract;
        address accountantContract;
        address litterAddress;
        address daoTreasuryContract;
        address daoAddress;
    }

    struct KittyPartyControllerVars {
        address kreator;
        uint256 kreatorStake;
        uint profit;
        uint profitToSplit;
        // The number of kittens inside that party
        uint8 localKittens;
        // A state representing whether the party has started and completed
        uint8 internalState;
    }
}
// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

contract KittyPartyStateTransition {

    enum KittyPartyStages {
        InitialCollection,
        Collection,
        Staking,
        Payout,
        Completed,
        Refund
    }   
    //Set of valid states for the kitty party contract
    //InitialCollection: This collection is different because it is before start of the rounds
    //Collection: Pre-Round verification completed, collection criteria can be checked for
    //Staking: The colection has been completed successfully, the asset can now be staked on respective protocols, we open up for bids in this state
    //Payout: The assets are withdrawn from the repective contracts, a winner is chosen at random
    //Completed: The kitty-party is over
    //Refund: Invalid state jump goto Refund -> create a provision to exit system for all stakeholders and refund only allowed to transition from Initial Collection
    KittyPartyStages public stage = KittyPartyStages.InitialCollection;
    //initial state is verification state
    uint256 public lastStageTime;
    uint16 public durationInDays;
    uint8 public currentRound;
    uint8 public timeToCollection;
    uint16 public numberOfRounds;

    event Completed();
    event StageTransition(uint prevStage, uint nextStage);
    
    modifier transitionAfter() {
        _;
        _nextStage(1);
    }
    
    function getStage() external view returns (uint) {
      return uint(stage);
    }

    function timeSinceChange() external view returns (uint) {
        return block.timestamp - lastStageTime;
    }

    function _atStage(KittyPartyStages _stage) internal view {
        require(stage == _stage, "Not in the expected stage");
    }

    function isTransitionRequired() external view returns(uint8) {
        if ((stage == KittyPartyStages.InitialCollection && (block.timestamp >= (lastStageTime + (timeToCollection * 1 days)))) ||
            (stage == KittyPartyStages.Collection && block.timestamp >= (lastStageTime + (3 * 1 hours))) ||
            (stage == KittyPartyStages.Staking && block.timestamp >= (lastStageTime + (durationInDays * 1 days))) ||
            (stage == KittyPartyStages.Payout && block.timestamp >= (lastStageTime + (8 * 1 hours)) && (numberOfRounds > currentRound)) ||
            (stage == KittyPartyStages.Payout && block.timestamp >= (lastStageTime + (8 * 1 hours)) && (numberOfRounds <= currentRound))) {
            return (uint8(stage) + (numberOfRounds > currentRound ? 0 : 1));
        } else {
            return (88);
        }
    }
    
    function _timedTransitions() internal {
        if (stage == KittyPartyStages.InitialCollection && (block.timestamp >= (lastStageTime + (timeToCollection * 1 days)))) {
           _nextStage(2);
        }
        else if (stage == KittyPartyStages.Collection && block.timestamp >= (lastStageTime + (3 * 1 hours))) {
            _nextStage(1);
        }
        else if (stage == KittyPartyStages.Staking && block.timestamp >= (lastStageTime + (durationInDays * 1 days))) {
            _nextStage(1);
        }
        else if (stage == KittyPartyStages.Payout && block.timestamp >= (lastStageTime + (8 * 1 hours)) && (numberOfRounds > currentRound)) {
            stage = KittyPartyStages(1);
            currentRound++;
        }
        else if (stage == KittyPartyStages.Payout && block.timestamp >= (lastStageTime + (8 * 1 hours)) && (numberOfRounds <= currentRound)) {
           _nextStage(1);
        }
    }

    function _nextStage(uint8 jumpTo) internal {
        uint nextStageValue = uint(stage) + jumpTo;
        if(nextStageValue > 6){
            nextStageValue = 6;
        }
        emit StageTransition(uint(stage), nextStageValue);
        stage = KittyPartyStages(nextStageValue);
        lastStageTime = block.timestamp;
    }

    function _initState(uint8 _timeToCollection) internal {
        require(stage ==  KittyPartyStages.InitialCollection, "Not in the InitialCollection stage");
        lastStageTime = block.timestamp;
        timeToCollection = _timeToCollection;
    }
}
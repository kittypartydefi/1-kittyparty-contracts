// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

/**
 * @dev Interface of the Kitty Party Yield Generator
 */
interface IKittyPartyYieldGenerator {
    struct KittyPartyYieldInfo { 
      uint256 lockedAmount;
      uint256 yieldGeneratedInLastRound;
      address sellTokenAddress;
      address poolAddress;
      address lpTokenAddress;
    }
    
    /**
     * @dev Create a new LockedValue in the pool
     */
    function createLockedValue(bytes calldata) external payable returns (uint256);
 
    /**
     * @dev Unwind a LockedValue in the pool
     */
    function unwindLockedValue(bytes calldata) external returns (uint256);

    /**
     * @dev Returns the address of the treasury contract
     */
    function treasuryAddress() external view returns (address);

    /**
     * @dev Returns the amount of tokens staked for a specific kitty party.
     */
    function lockedAmount(address) external view returns (uint256);

    /**
     * @dev Returns the amount of tokens staked for a specific kitty party.
     */
    function yieldGenerated(address) external view returns (uint256);

    /**
     * @dev Returns the pool in which the kitty party tokens were staked
     */
    function lockedPool(address) external view returns (address);

    /**
     * @dev Returns the pool in which the kitty party tokens were staked
     */
    function setPlatformRewardContractAddress(address payable) external;
    function setPlatformDepositContractAddress(address payable) external;
    function setPlatformWithdrawContractAddress(address payable) external;
    function setPartyInfo(address, address) external;
}
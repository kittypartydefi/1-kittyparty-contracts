// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "../interfaces/IKittyPartyYieldGenerator.sol";

contract KittyPartyYieldGeneratorAave is Initializable, IKittyPartyYieldGenerator, OwnableUpgradeable {
    address private _treasuryContract;
    address payable public AaveContract;
    address payable public AaveRewardContract;

    uint256 public constant MAX = type(uint128).max;
    uint256 totalLocked;

    mapping(address => IKittyPartyYieldGenerator.KittyPartyYieldInfo) public kittyPartyYieldInfo;

    function __KittyPartyYieldGeneratorAave_init(address treasuryContractParam) public initializer {
        _treasuryContract = treasuryContractParam;
        __Ownable_init();
    }

    function setAllowanceDeposit(address _kittyParty) public {
        address sellToken = kittyPartyYieldInfo[_kittyParty].sellTokenAddress;
        require(IERC20Upgradeable(sellToken).approve(AaveContract, MAX), "Not able to set allowance");
    }

    function setAllowanceWithdraw(address _kittyParty) public {
        address lpTokenAddress = kittyPartyYieldInfo[_kittyParty].lpTokenAddress;
        require(IERC20Upgradeable(lpTokenAddress).approve(AaveContract, MAX), "Not able to set allowance");
    }

    /**
     * @dev This function deposits DAI and receives equivalent amount of atokens
     */    
    function createLockedValue(bytes calldata) 
        external 
        payable
        override
        returns (uint256 vaultTokensRec)
    {
        address sellToken = kittyPartyYieldInfo[msg.sender].sellTokenAddress;
        address lpToken = kittyPartyYieldInfo[msg.sender].lpTokenAddress;

        require(IERC20Upgradeable(sellToken).approve(AaveContract, MAX), "Not enough allowance");
        uint daiBalance = IERC20Upgradeable(sellToken).balanceOf(address(this));
        uint256 initialBalance = IERC20Upgradeable(lpToken).balanceOf(address(this));

        bytes memory payload = abi.encodeWithSignature("deposit(address,uint256,address,uint16)", sellToken, daiBalance, address(this), 0);
        (bool success,) = address(AaveContract).call(payload);
        require(success, 'Deposit Failed');
        
        vaultTokensRec = IERC20Upgradeable(lpToken).balanceOf(address(this)) - initialBalance;
        kittyPartyYieldInfo[msg.sender].lockedAmount += vaultTokensRec;
        totalLocked += vaultTokensRec;
    }

    /**
     * @dev This function claims accrued rewards and withdraws the deposited tokens and sends them to the treasury contract
     */
    function unwindLockedValue(bytes calldata) 
        external 
        override 
        returns (uint256 tokensRec)
    {
        // Get funds back in the same token that we sold in  DAI, since for now the treasury only releases DAI
        require(IERC20Upgradeable(kittyPartyYieldInfo[msg.sender].sellTokenAddress).approve(AaveContract, MAX), "Not enough allowance");

        uint lpTokenBalance = IERC20Upgradeable(kittyPartyYieldInfo[msg.sender].lpTokenAddress).balanceOf(address(this));

        // Create an array with lp token address
        address[] memory lpTokens = new address[](1);
        lpTokens[0] = kittyPartyYieldInfo[msg.sender].lpTokenAddress; 
        // Check the balance of accrued rewards
        bytes memory payload = abi.encodeWithSignature("getRewardsBalance(address[],address)", lpTokens, address(this));
        (bool success, bytes memory returnData) = address(AaveRewardContract).staticcall(payload);
        
        uint256 rewardTokenBalance = 0;

        if(success == true) {
            (rewardTokenBalance) = abi.decode(returnData, (uint256));
            // Claim balance rewards
            payload = abi.encodeWithSignature("claimRewards(address[],uint256,address)", lpTokens, rewardTokenBalance, _treasuryContract);
            (success,) = address(AaveRewardContract).call(payload);
        }

        kittyPartyYieldInfo[msg.sender].yieldGeneratedInLastRound =  lpTokenBalance * (kittyPartyYieldInfo[msg.sender].lockedAmount / totalLocked);
        totalLocked -= kittyPartyYieldInfo[msg.sender].lockedAmount;

        // Withdraws deposited DAI and burns atokens
        payload = abi.encodeWithSignature("withdraw(address,uint256,address)",kittyPartyYieldInfo[msg.sender].sellTokenAddress,kittyPartyYieldInfo[msg.sender].yieldGeneratedInLastRound,_treasuryContract);
        (success,) = address(AaveContract).call(payload);
        require(success, 'Withdraw failed');
        return  kittyPartyYieldInfo[msg.sender].yieldGeneratedInLastRound;
    }

    function treasuryAddress() external view override returns (address treasuryContractAddress) {
        return _treasuryContract;
    }

    function lockedAmount(address kittyParty) external view override returns (uint256 totalLockedValue) {
        return kittyPartyYieldInfo[kittyParty].lockedAmount;
    }

    function yieldGenerated(address kittyParty) external view override returns (uint256 yieldGeneratedInLastRound) {
        return kittyPartyYieldInfo[kittyParty].yieldGeneratedInLastRound;
    }

    function lockedPool(address kittyParty) external view override returns (address) {
        return kittyPartyYieldInfo[kittyParty].poolAddress;
    }

    function setPlatformDepositContractAddress(address payable _AaveContract) external override onlyOwner {
        AaveContract = _AaveContract;
    }

    function setPlatformRewardContractAddress(address payable _AaveRewardContract) external override onlyOwner {
        AaveRewardContract = _AaveRewardContract;
    }

    function setPartyInfo(address _sellTokenAddress, address _lpTokenAddress) external override {
        kittyPartyYieldInfo[msg.sender].sellTokenAddress = _sellTokenAddress;
        kittyPartyYieldInfo[msg.sender].lpTokenAddress = _lpTokenAddress;
    }

    function setPlatformWithdrawContractAddress(address payable) external override onlyOwner {
    }

    /**@dev emergency drain to be activated by DAO
     */
    function withdraw(
        IERC20Upgradeable token, 
        address recipient, 
        uint256 amount
    ) 
        public 
        onlyOwner 
    {
        token.transfer(recipient, amount);
    }
}
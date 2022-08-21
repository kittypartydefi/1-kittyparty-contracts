// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import '../interfaces/IKittyPartyInit.sol';
import "../interfaces/IKittyPartyYieldGenerator.sol";

contract KittyPartyYieldGeneratorAave is Initializable, IKittyPartyYieldGenerator, OwnableUpgradeable {
    address _treasuryContract;
    address payable public AaveContract;
    address payable public AaveRewardContract;
    address public rewardTokenAddress;

    uint256 public constant MAX = type(uint256).max;
    uint256 public totalLocked;

    mapping(address => IKittyPartyYieldGenerator.KittyPartyYieldInfo) public kittyPartyYieldInfo;

    event YieldCreated(uint256 lpTokens, uint256 sellTokens);
    event RewardsClaimed(bool rewardsClaimed,uint256 rewardTokenBalance);
    event YieldClaimed(uint256 lpTokens);

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
        IERC20Upgradeable(rewardTokenAddress).approve(AaveRewardContract, MAX);
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
        uint256 daiBalance = IERC20Upgradeable(sellToken).balanceOf(address(this));
        uint256 initialBalance = IERC20Upgradeable(lpToken).balanceOf(address(this));

        bytes memory payload = abi.encodeWithSignature("deposit(address,uint256,address,uint16)",
                                                       sellToken,
                                                       daiBalance,
                                                       address(this),
                                                       0);
        (bool success,) = address(AaveContract).call(payload);
        require(success, 'Deposit Failed');
        
        vaultTokensRec = IERC20Upgradeable(lpToken).balanceOf(address(this)) - initialBalance;
        kittyPartyYieldInfo[msg.sender].lockedAmount += vaultTokensRec;
        totalLocked += vaultTokensRec;
        emit YieldCreated(vaultTokensRec, daiBalance);
    }

    /**
     * @dev This function claims accrued rewards and withdraws the deposited tokens and sends them to the treasury contract
     */
    function unwindLockedValue(bytes calldata) 
        external 
        override 
        returns (uint256 tokensRec)
    {
        IKittyPartyYieldGenerator.KittyPartyYieldInfo storage kpInfo = kittyPartyYieldInfo[msg.sender];
        
        bytes memory payload = abi.encodeWithSignature("kittyInitiator()");
        (bool success, bytes memory returnData) = address(msg.sender).staticcall(payload);
        
        IKittenPartyInit.KittyInitiator memory kittyInitiator = abi.decode(returnData, (IKittenPartyInit.KittyInitiator));
        // Get funds back in the same token that we sold in  DAI, since for now the treasury only releases DAI
        require(IERC20Upgradeable(kpInfo.sellTokenAddress).approve(AaveContract, MAX), "Not enough allowance");
        uint256 rewardTokenBalance = 0;
        uint256 lpTokenBalance = IERC20Upgradeable(kpInfo.lpTokenAddress).balanceOf(address(this));

        //set party yield as a portion of claimable pool
        kpInfo.yieldGeneratedInLastRound = (lpTokenBalance * kpInfo.lockedAmount / totalLocked);
        totalLocked -= kpInfo.lockedAmount;

        // Create an array with lp token address for checking rewards
        address[] memory lpTokens = new address[](1);
        lpTokens[0] = kpInfo.lpTokenAddress; 
        // Check the balance of accrued rewards
        payload = abi.encodeWithSignature("getRewardsBalance(address[],address)",
                                                        lpTokens,
                                                        address(this));
        (bool rewardsExists, bytes memory return_Data) = address(AaveRewardContract).staticcall(payload);

        if(rewardsExists == true) {
            (rewardTokenBalance) = abi.decode(return_Data, (uint256));
            // Claim balance rewards and sent to treasury
            payload = abi.encodeWithSignature("claimRewards(address[],uint256,address)",
                                              lpTokens,
                                              rewardTokenBalance,
                                              _treasuryContract);
            (bool rewardsClaimed,) = address(AaveRewardContract).call(payload);
            emit RewardsClaimed(rewardsClaimed, rewardTokenBalance);
        }

        // Withdraws deposited DAI and burns atokens
        payload = abi.encodeWithSignature("withdraw(address,uint256,address)",
                                          kpInfo.sellTokenAddress,
                                          kpInfo.yieldGeneratedInLastRound,
                                          _treasuryContract);
        (success,) = address(AaveContract).call(payload);
        require(success, 'Withdraw failed');

        emit YieldClaimed(kpInfo.yieldGeneratedInLastRound);

        return  kpInfo.yieldGeneratedInLastRound;
    }

    function treasuryAddress() external view override returns (address treasuryContractAddress) {
        return _treasuryContract;
    }

    function lockedAmount(address kittyParty) external view override returns (uint256 totalLockedValue) {
        return kittyPartyYieldInfo[kittyParty].lockedAmount;
    }

    function yieldCurrent(address kittyParty) external view returns (uint256 yieldToBeGeneratedInCurrentRound) {
        uint256 lpTokenBalance = IERC20Upgradeable(kittyPartyYieldInfo[kittyParty].lpTokenAddress).balanceOf(address(this));
        return lpTokenBalance * kittyPartyYieldInfo[kittyParty].lockedAmount / totalLocked;
    }

    function yieldGenerated(address kittyParty) external view override returns (uint256) {
        return kittyPartyYieldInfo[kittyParty].yieldGeneratedInLastRound;
    }

    function lockedPool(address kittyParty) external view override returns (address) {
        return kittyPartyYieldInfo[kittyParty].poolAddress;
    }

    function setPlatformDepositContractAddress(address payable _AaveContract) external override onlyOwner {
        AaveContract = _AaveContract;
    }

    function setPlatformRewardContractAddress(address payable _AaveRewardContract, address _rewardTokenAddress) external override onlyOwner {
        AaveRewardContract = _AaveRewardContract;
        rewardTokenAddress = _rewardTokenAddress;
    }

    //@dev allow party to set their own pair of addresses for yield
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
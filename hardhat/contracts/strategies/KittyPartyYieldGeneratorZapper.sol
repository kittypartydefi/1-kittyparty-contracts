// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "../interfaces/IKittyPartyYieldGenerator.sol";


contract KittyPartyYieldGeneratorZapper is Initializable, IKittyPartyYieldGenerator, OwnableUpgradeable {
    address private _treasuryContract;
    address payable public ZapInContract;
    address payable public ZapOutContract;

    uint256 public constant MASK = type(uint128).max;

    mapping(address => IKittyPartyYieldGenerator.KittyPartyYieldInfo) public kittyPartyYieldInfo;

    event KittyPartyReadyToYield(address kittyparty, uint256 amountPerRound);

    function __KittyPartyYieldGeneratorZapper_init(address treasuryContractParam) public initializer {
        _treasuryContract = treasuryContractParam;
        __Ownable_init(); //Later remove onlyOwner and change to only kitty party
    }

    function setAllowanceZapIn() public onlyOwner {
        address sellToken = kittyPartyYieldInfo[msg.sender].sellTokenAddress;
        require(IERC20Upgradeable(sellToken).approve(ZapInContract, MASK), "Not able to set allowance");
    }

    function setAllowanceZapOut() public onlyOwner {
        address lpTokenAddress = kittyPartyYieldInfo[msg.sender].lpTokenAddress;
        require(IERC20Upgradeable(lpTokenAddress).approve(ZapOutContract, MASK), "Not able to set allowance");
    }
     
     /**
     * @dev See IKittyPartyYieldGenerator.sol
     */
    function createLockedValue(bytes calldata zapCallData) 
        external 
        override
        onlyOwner //Later this will be all controllers but upto a specific amount
        payable // Must attach ETH equal to the `value` field from the API response.
        returns (uint256  vaultTokensRec)
    {
        address sellToken = kittyPartyYieldInfo[msg.sender].sellTokenAddress;
        address lpToken = kittyPartyYieldInfo[msg.sender].lpTokenAddress;
        require(IERC20Upgradeable(sellToken).approve(ZapInContract, MASK), "Not enough allowance");
        // Check this contract's initial balance
        uint256 initialBalance = IERC20Upgradeable(lpToken).balanceOf(address(this));

        (bool success,) = ZapInContract.call{value: msg.value}(zapCallData);
        require(success, 'Zap In Failed');

        vaultTokensRec = IERC20Upgradeable(lpToken).balanceOf(address(this)) - initialBalance;
        kittyPartyYieldInfo[msg.sender].lockedAmount = vaultTokensRec;
    }
 
    /**
     * @dev See IKittyPartyYieldGenerator.sol, This contract unlocks value and sends it to the treasury contract
     */
    function unwindLockedValue(bytes calldata zapCallData) 
        external 
        override 
        returns (uint256 tokensRec)
    {
        // bytes memory payload = abi.encodeWithSignature("stage()");
        // (bool successStage, bytes memory returnData) = address(kittyParty).staticcall(payload);
        // require(successStage, "Not a valid kitty party");
        // (uint stage) = abi.decode(returnData, (uint256));
        // require(stage == 3, "Not in unwind stage");


        //Get funds back in the same token that we sold in  DAI, since for now the treasury only releases DAI
        address lpToken = kittyPartyYieldInfo[msg.sender].sellTokenAddress;
        address sellToken = kittyPartyYieldInfo[msg.sender].lpTokenAddress;
        require(IERC20Upgradeable(sellToken).approve(ZapOutContract, MASK), "Not enough allowance");
        // Check this contract's initial balance
        uint256 initialBalance = lpToken == address(0)
        ? address(this).balance
        : IERC20Upgradeable(lpToken).balanceOf(address(this));
        // Call the encoded Zap Out function call on the contract at `ZapOutContract`,
        (bool success,) = ZapOutContract.call(zapCallData);
        require(success, 'Zap Out Failed');
        uint256 finalBalance = lpToken == address(0)
        ? address(this).balance
        : IERC20Upgradeable(lpToken).balanceOf(address(this));
        tokensRec = finalBalance - initialBalance;
        kittyPartyYieldInfo[msg.sender].yieldGeneratedInLastRound = tokensRec;
        //Send the tokens to the treasury
        IERC20Upgradeable(lpToken).transfer(_treasuryContract , finalBalance);
    }

    /**
     * @dev See IKittyPartyYieldGenerator.sol
     */
    function treasuryAddress() external view override returns (address treasuryContractAddress) {
        return _treasuryContract;
    }

    /**
     * @dev See IKittyPartyYieldGenerator.sol
     */
    function lockedAmount(address kittyParty) external view override returns (uint256 totalLockedValue) {
        return kittyPartyYieldInfo[kittyParty].lockedAmount;
    }

    /**
     * @dev See IKittyPartyYieldGenerator.sol
     */
    function yieldGenerated(address kittyParty) external view override returns (uint256 yieldGeneratedInLastRound) {
        return kittyPartyYieldInfo[kittyParty].yieldGeneratedInLastRound;
    }

    /**
     * @dev See IKittyPartyYieldGenerator.sol
     */
    function lockedPool(address kittyParty) external view override returns (address) {
        return kittyPartyYieldInfo[kittyParty].poolAddress;
    }

    /**
    * @dev See IKittyPartyYieldGenerator.sol
    */
    function setPlatformDepositContractAddress(address payable _zapInContract) external override onlyOwner {
        ZapInContract = _zapInContract;
    }

        /**
    * @dev See IKittyPartyYieldGenerator.sol
    */
    function setPlatformWithdrawContractAddress(address payable _zapOutContract) external override onlyOwner {
        ZapOutContract = _zapOutContract;
    }

    function setPlatformRewardContractAddress(address payable,address) external override onlyOwner {
    }

    function setPartyInfo(address _sellTokenAddress, address _lpTokenAddress ) external override {
        kittyPartyYieldInfo[msg.sender].sellTokenAddress = _sellTokenAddress;
        kittyPartyYieldInfo[msg.sender].lpTokenAddress = _lpTokenAddress;
    }

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
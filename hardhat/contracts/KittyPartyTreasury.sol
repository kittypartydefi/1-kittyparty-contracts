// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "hardhat/console.sol";

contract KittyPartyTreasury is Initializable {
    IERC20 public dai;
    IERC20 public kpt;
    address accountantContract;
    uint256 bonusKPTPerToken;
    address daoAddress;

    event RedemptionRequested(address redeemer, uint256 amount, uint256 bonus);
    modifier onlyDAOAddress(){
        require(msg.sender == daoAddress);
        _;
    }

    function __KittyPartyTreasury_init(
        address _dai_address,
        address _kpt_address,
        address _daoAddress,
        address _accountantContract
    ) 
        public
        initializer
    {
        accountantContract = _accountantContract;
        daoAddress = _daoAddress;   
        dai = IERC20(_dai_address);
        kpt = IERC20(_kpt_address);
        bonusKPTPerToken = 1;
    }

    function setBonusKPT(uint _amountToReward) external onlyDAOAddress {
        bonusKPTPerToken = _amountToReward;
    }

    function setDAOAddress(address _daoAddress) external onlyDAOAddress {
        daoAddress = _daoAddress;
    }

    function setAccountant(address _accountantContract) external onlyDAOAddress {
        accountantContract = _accountantContract;
    }

    function redeemTokens(uint256 redeemAmount) external {
        uint256 daiBalance = dai.balanceOf(address(this));
        require(daiBalance > redeemAmount, "Insufficient balance to transfer");

        bytes memory payload = abi.encodeWithSignature("burn(address,uint256,uint256)", msg.sender, 0, redeemAmount);
        // for profit to be calculated we need to unwind the position succesfuly the profit - X% to kreator and Y% to contract becomes the winning
        (bool success,) = address(accountantContract).call(payload);
        require(success, "Not able to burn receipts");
        emit RedemptionRequested(msg.sender, redeemAmount, bonusKPTPerToken * redeemAmount);

        require(dai.transfer(address(msg.sender), redeemAmount), 'Transfer Failed');
        if(bonusKPTPerToken > 0){
            kpt.transfer(address(msg.sender), bonusKPTPerToken * redeemAmount);
        }
    }

    function withdraw(IERC20 token, address recipient, uint256 amount) public onlyDAOAddress {
        token.transfer(recipient, amount);
    }
}

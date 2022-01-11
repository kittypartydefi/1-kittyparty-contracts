// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import  { config, ethers, network } from "hardhat";
import { Contract } from 'ethers';
import fs from 'fs';

import * as hre from "hardhat";
import { KittyPartyFactory, ERC20} from '../src/types/index';

let timeParameter = 60 * 60;
async function main() {
  const [deployer, kreator, kitten1, kitten2] = await ethers.getSigners();
  const kittyparty = '0x800484C796249EB75F91e5438741C586EBaA2092';
  const kittyPartyTreasuryAddress = '0x1430DAffe56EaE08f25eEf5B9885a3Ac4FD77DC4';
  // const inviteHash = '0x647942707769507670796569446f7474347a3235546100000000000000000000';
  const Token = await ethers.getContractFactory("ERC20");
  let dai_address = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F";

  // let kittyPartyFactory:KittyPartyFactory = await _KittyPartyFactory.attach(kp_factory) as KittyPartyFactory;
  let dai:ERC20 = await Token.attach(dai_address) as ERC20;


  await delay(3000);
    const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
    let kittyPartyController = await _KittyPartyController.attach(kittyparty);
    const _KittyPartyTreasury = await ethers.getContractFactory("KittyPartyTreasury");
    let kittyPartyTreasuryD = await _KittyPartyTreasury.attach(kittyPartyTreasuryAddress);
    const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
    const kittyPartyAccountant = await _KittyPartyAccountant.attach("0xD24Cc1c2D6dCC4af08d89121DdC0ACAa13A4c4C4");
    const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
    const kittyPartyYieldGeneratorAave = await yielderFactory.attach("0xc1572Cb747a7Ee639896efa38f24783ecbDB8f89");

console.log("deployer -- ", deployer.address);
/**
 * 0 - set allowances, deposit and add a kitten
 * 1 - attempt stopStaking Payfees and winner KittyPartyWinnerSelection
 * 2 - complete party
 * 3 - claim
 * 4 - force withdraw
 * 5 - refund
 * 6 - check balances
 */
    const step:number =3;

switch(step)
{
  case 0:{
    // await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyController.address);
    await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyController.address);
    // await dai.connect(kitten1).approve(kittyparty,ethers.utils.parseUnits("20"));
    // console.log('approved');

    // await delay(20000);


    // await kittyPartyController.connect(kitten1).depositAndAddKittenToParty("0x376379734a485941555865704c646e706e6e7341696100000000000000000000")
    let getInternalStage = await kittyPartyController.kittyPartyControllerVars();
    console.log('internalState::', getInternalStage)
    let stage = await kittyPartyController.getStage();
    console.log('stage::', stage);
    let transition = await kittyPartyController.isTransitionRequired();
    console.log('transition::', transition);
    break;

  }
  case 1:{

    let stage = await kittyPartyController.getStage();
    let lastStageTime = await kittyPartyController.lastStageTime();
    let duration = await kittyPartyController.durationInDays();
    
    console.log('stage::lastStageTime, duration', stage,  lastStageTime, duration);
    // await kittyPartyController.stopStaking();
    // await delay(50000);
    // console.log('stopStaking completed')


    // await kittyPartyController.payOrganizerFees();
    // await delay(50000);
    // console.log('payOrganizerFees completed')
    
    await kittyPartyController.applyWinnerStrategy({gasLimit: 5000000});
    console.log('applyWinnerStrategy completed')

    break;
  }
  case 2:{
    // await network.provider.send("evm_increaseTime", [9*timeParameter]);

    let stage = await kittyPartyController.getStage();
    console.log('stage::', stage)
    await kittyPartyController.applyCompleteParty();
    let getInternalStage = await kittyPartyController.kittyPartyControllerVars();
    console.log('internalState::', getInternalStage)
    break;
  }
  case 3:{

    let myBalance = await dai.balanceOf(kitten1.address);
    console.log("Before 1- ", myBalance);
    let myBalance2 = await dai.balanceOf(kitten2.address);
    console.log("Before 2- ", myBalance2);

    let myBalance01 = await kittyPartyAccountant.balanceOf(kitten1.address, 0);
    console.log("Before myBalance01- ", myBalance01);
    let myBalance02 = await kittyPartyAccountant.balanceOf(kitten2.address, 0);
    console.log("Before myBalance02- ", myBalance02);
      // await kittyPartyAccountant.connect(kitten1).setApprovalForAll(kittyPartyTreasuryAddress, true);
      // await kittyPartyAccountant.connect(kitten2).setApprovalForAll(kittyPartyTreasuryAddress, true);
      // await delay(50000);
    //  let approve1 =  await kittyPartyAccountant.connect(kitten1).isApprovedForAll(kitten1.address, kittyPartyTreasuryAddress);
    //  let approve2 =  await kittyPartyAccountant.connect(kitten2).isApprovedForAll(kitten2.address, kittyPartyTreasuryAddress);
    //  console.log("approve1 1- ", approve1);
    //  console.log("approve2 2- ", approve2);
    //20580172625563659985
    //20000000000000000000



    await kittyPartyTreasuryD.connect(kitten1).redeemTokens(ethers.utils.parseUnits("18"));
    await kittyPartyTreasuryD.connect(kitten2).redeemTokens(ethers.utils.parseUnits("18"));
    myBalance = await dai.balanceOf(kitten1.address);
    console.log("After 1- ", myBalance);
    myBalance2 = await dai.balanceOf(kitten2.address);
    console.log("After 2- ", myBalance2);
    
  }
  case 4:{
    const depositReceiptToken = await ethers.getContractFactory("ERC20");
    const aaveDaiContractAddress = "0x27f8d03b3a2196956ed754badc28d73be8830a6e";

    let daiDepositReceiptToken = await depositReceiptToken.attach(aaveDaiContractAddress);
    let ygBalance = await daiDepositReceiptToken.balanceOf(kittyPartyYieldGeneratorAave.address);
    console.log(ygBalance)
    await kittyPartyYieldGeneratorAave.withdraw(aaveDaiContractAddress, deployer.address, ygBalance)

    break;
  }
  case 5:{
    console.log("Attempting Refunds ....");
    
    await kittyPartyController.connect(kreator).issueRefund();

    let myBalance = await dai.balanceOf(kreator.address);
    console.log("Before 1- ", myBalance);
    

    let myBalance01 = await kittyPartyAccountant.balanceOf(kreator.address, 0);
    console.log("Before myBalance01- ", myBalance01);
   
    await kittyPartyAccountant.connect(kreator).setApprovalForAll(kittyPartyTreasuryAddress, true);
      
     let approve1 =  await kittyPartyAccountant.connect(kreator).isApprovedForAll(kreator.address, kittyPartyTreasuryAddress);
     
     console.log("approve1 1- ", approve1);


    await kittyPartyTreasuryD.connect(kreator).redeemTokens(ethers.utils.parseUnits("2"));
    myBalance = await dai.balanceOf(kreator.address);
    console.log("After 1- ", myBalance);

    break;
  }
  case 6:{

    let myBalance1 = await dai.balanceOf(kitten1.address);
    console.log("Before 1- ", myBalance1);
    let myBalance2 = await dai.balanceOf(kitten2.address);
    console.log("Before 2- ", myBalance2);

    let myBalance01 = await kittyPartyAccountant.balanceOf(kitten1.address, 0);
    console.log("Before myBalance01- ", myBalance01);
    let myBalance02 = await kittyPartyAccountant.balanceOf(kitten2.address, 0);
    console.log("Before myBalance02- ", myBalance02);
    let myBalance = await dai.balanceOf(kreator.address);
    console.log("Before 1- ", myBalance);
    break;
  }
  case 7:{

    let Planetary = await kittyPartyAccountant.balanceOf(kreator.address, 1);
    console.log("Planetary 1- ", Planetary);
    break;
  }
  case 8:{

    await kittyPartyController.connect(kreator).issueRefund();

    break;
  }
  default: { 
    console.log("I am in defualt");
    break;
} 
}
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
  main()
  .then( async (deployedData) => {
    await delay(30000);
      process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
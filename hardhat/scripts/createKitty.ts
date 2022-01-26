// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import  { config, ethers, network } from "hardhat";
import { Contract } from 'ethers';
import fs from 'fs';
let  contractAddresses =  require("../test/ContractAddresses.ts");

import * as hre from "hardhat";
import { KittyPartyFactory, KittyPartyAccountant, ERC20} from '../src/types/index';


async function main() {
  const [deployer, kreator, kitten1, kitten2] = await ethers.getSigners();

  // console.log("The deployer is -", deployer.address, kreator.address, kitten1.address, kitten2.address);

  // Deploy example contract addresses for development and testing purposes, comment out before testnet deployment
  // Or use your own addressess
  const _KittyPartyFactory = await ethers.getContractFactory("KittyPartyFactory");
  const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
  const Token = await ethers.getContractFactory("ERC20");

  let dai_address = contractAddresses.mumbai.sellTokenAddress;
  let kp_factory = "0x1c6606B4cd8877a8ec83A2a2c2CC7D523DddC532";
  let yieldContract = "0x254B6DB4A0E016F0DB63fd45e215D1209C6800F1";
  let winnerStrategyAddress = "0x09337703Dbb60cC6871837CF6740b47f51Bf7bc2";
  let kp_accountant = "0xDAd7BaFf3C5e52e6619fEE03869c4E6678F2dea5";

  let kittyPartyFactory:KittyPartyFactory = await _KittyPartyFactory.attach(kp_factory) as KittyPartyFactory;
  let kittyPartyAccountant:KittyPartyAccountant = await _KittyPartyAccountant.attach(kp_accountant) as KittyPartyAccountant;
  let dai:ERC20 = await Token.attach(dai_address) as ERC20;

  let KittyInitiator = 
  {
     winnerStrategy: winnerStrategyAddress,      
     kreatorFeesInBasisPoints: 100,
     daoFeesInBasisPoints: 100,
     winningStrategy: 1,
     timeToCollection: 1, 
     maxKittens: 2,
     durationInDays: 1,
     amountInDAIPerRound: ethers.utils.parseUnits("20"),
     partyName: ethers.utils.formatBytes32String("speed party"),
     daiAddress: dai_address,
     yieldContract: yieldContract
  };

  let KittyYieldArgs = {
    sellTokenAddress: contractAddresses.mumbai.sellTokenAddress,
    lpTokenAddress: contractAddresses.mumbai.aaveDaiContractAddress
  };
    // await dai.connect(kreator).approve(kittyPartyFactory.address, (KittyInitiator.amountInDAIPerRound.div(10)).toString());
    // await delay(15000);
    // console.log("Approved DAI")
    // let kpfactory ={
    //   "tomCatContract" : "0x633A670D65271CE622d7eCB5E8B0e45FE571d650",
    //   "accountantContract" :  "0xDAd7BaFf3C5e52e6619fEE03869c4E6678F2dea5",
    //   "litterAddress" : "0xe0Fa3e52b26872c5361a6Cf49fd1ff63AF7eecD3",
    //   "daoTreasuryContract" : "0x18B9bCE8aB31b927B11b0A1fA0dA528b45967EE6", 
    //   "keeperContractAddress" : "0xeA67d996F6c2BF48D820cdC859E45F51C4A1eEBD"
    // }
    // await kittyPartyFactory.setFactoryInit(kpfactory);
    // await delay(35000);
    // console.log("Kreator", kreator.address)
    // console.log("KittyInitiator", KittyInitiator, KittyYieldArgs)
  // const kpfactory_ =   await kittyPartyFactory.kpFactory();
  //  await kittyPartyFactory.setApprovedStrategy(yieldContract);
  //   await delay(35000);
  //   console.log("kittyPartyFactory", kpfactory_, kpfactory)

  // await kittyPartyAccountant.mint(kreator.address, 1, 10, "0x");
  // await delay(10000);
  // const planetary_balance = await kittyPartyAccountant.balanceOf(kreator.address, 1);
  // console.log("Planetary balance:", planetary_balance.toString());


    // const instance = await kittyPartyFactory.connect(kreator).createKitty(KittyInitiator, KittyYieldArgs, {gasLimit:6000000});
    // await delay(15000);
    // console.log("deployedKitty ...");

    let deployedKitty = await kittyPartyFactory.connect(kreator).getMyKitties(kreator.address);
    
    // await delay(3000);
    // console.log('deployedKitty[deployedKitty.length - 1]::',JSON.stringify(deployedKitty[deployedKitty.length - 1]));
    const kittyPartyDeployed = deployedKitty[deployedKitty.length - 1];
    const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
    let kittyPartyController = await _KittyPartyController.attach(kittyPartyDeployed);

    await kittyPartyController.connect(kreator).issueRefund();

    // let stage = await kittyPartyController.getStage();
    // console.log('stage::', stage.toString());

     // comment below for round 2 call
    // await dai.connect(kitten1).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
    // await dai.connect(kitten2).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));

    // const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
    // const kittyPartyYieldGeneratorAave = await yielderFactory.attach(yieldContract);
    // await delay(20000);
      
    // await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyDeployed);
    // await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyDeployed);
    // await delay(20000);
    // console.log('depositAndAddKittenToParty::');
    
    //    // end comment below for round2 call
    // //comment below for round 1 call

    // await kittyPartyController.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
    // await delay(20000);

    // await kittyPartyController.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
    // console.log('depositAndAddKittenToParty 1/2..');

    // await kittyPartyController.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"), {"gasLimit": 6000000});
    // console.log('depositAndAddKittenToParty 2/2');

    let controllerVars = await kittyPartyController.kittyPartyControllerVars();

    // await network.provider.send("evm_increaseTime", [1*24*3600]);
    let stage = await kittyPartyController.getStage();
    console.log('stage::', stage.toString(), controllerVars.internalState);

    // console.log('applyInitialVerification started..');

    // //initiate the party
    // await delay(20000);
    // await kittyPartyController.connect(kreator).applyInitialVerification();

    // console.log('applyInitialVerification completed..');
    // stage = await kittyPartyController.getStage();
    // console.log('stage::', stage)
  

}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
  main()
  .then( async (deployedData) => {
    await delay(3000);
      process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
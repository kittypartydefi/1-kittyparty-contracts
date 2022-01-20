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
import { KittyPartyFactory, ERC20} from '../src/types/index';


async function main() {
  const [deployer] = await ethers.getSigners();

  // console.log("The deployer is -", deployer.address, kreator.address, kitten1.address, kitten2.address);

  // Deploy example contract addresses for development and testing purposes, comment out before testnet deployment
  // Or use your own addressess
  const _KittyPartyFactory = await ethers.getContractFactory("KittyPartyFactory");
  const Token = await ethers.getContractFactory("ERC20");

  let dai_address = contractAddresses.mumbai.sellTokenAddress;
  let kp_factory = "0xdd1c0a7caA9da0c3920703db75b30E52d9561386";
  let yieldContract = "0x3Fb4c0b809D581089e151Dedfb1a51771374C16a";
  let winnerStrategyAddress = "0x4fDed948F85074F9648C5C31675075748eb86c35";

  let kittyPartyFactory:KittyPartyFactory = await _KittyPartyFactory.attach(kp_factory) as KittyPartyFactory;
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
    console.log("Approved DAI")
    let kpfactory ={
      "tomCatContract" : "0x501563189CEf578Cfb747dA23e4589B32c2b3E1c",
      "accountantContract" :  "0x06c219c50C73B674b193080f86e9716B83F79194",
      "litterAddress" : "0xA5b904634A2eB8C87D8c9a3D8A8798C5FA1cDEe8",
      "daoTreasuryContract" : "0xCeC37C32A270bCcE22FccdBd89D41d4205f4Dd57", 
      "keeperContractAddress" : "0x87Cb7f2513b1693DAA02dAF24ee00AdAeC43bF14"
    }
    await kittyPartyFactory.setFactoryInit(kpfactory);
    await delay(35000);
    // console.log("Kreator", kreator.address)
    // console.log("KittyInitiator", KittyInitiator, KittyYieldArgs)
  const kpfactory_ =   await kittyPartyFactory.kpFactory();
  //  await kittyPartyFactory.setApprovedStrategy(yieldContract);
  //   await delay(35000);
    console.log("kittyPartyFactory", kpfactory_, kpfactory)

    // const instance = await kittyPartyFactory.connect(kreator).createKitty(KittyInitiator, KittyYieldArgs, {gasLimit:6000000});
    await delay(15000);
    console.log("deployedKitty ...")

    // let deployedKitty = await kittyPartyFactory.connect(kreator).getMyKitties(kreator.address);
    
    // // await delay(3000);
    // // console.log('deployedKitty[deployedKitty.length - 1]::',JSON.stringify(deployedKitty[deployedKitty.length - 1]));
    // const kittyPartyDeployed = deployedKitty[deployedKitty.length - 1];
    // const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
    // let kittyPartyController = await _KittyPartyController.attach(kittyPartyDeployed);

    // let stage = await kittyPartyController.getStage();
    // console.log('stage::', stage)

     // // comment below for round 2 call
    // await dai.connect(kitten1).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
    // await dai.connect(kitten2).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));

    // const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
    // const kittyPartyYieldGeneratorAave = await yielderFactory.attach(yieldContract);
    // await delay(20000);
      
    // // await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyDeployed);
    // await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyDeployed);
    // await delay(20000);
    // console.log('depositAndAddKittenToParty::')
    
    //    // end comment below for round2 call
    // //comment below for round 1 call

    // await kittyPartyController.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
    // await delay(20000);

    // await kittyPartyController.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
    // console.log('depositAndAddKittenToParty 1/2..')

    // await kittyPartyController.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"), {"gasLimit": 6000000});
    // console.log('depositAndAddKittenToParty 2/2')

    // let getInternalStage = await kittyPartyController.kittyPartyControllerVars();

    // // await network.provider.send("evm_increaseTime", [1*24*3600]);
    // stage = await kittyPartyController.getStage();
    // console.log('stage::', stage, getInternalStage);

    // console.log('applyInitialVerification started..')

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
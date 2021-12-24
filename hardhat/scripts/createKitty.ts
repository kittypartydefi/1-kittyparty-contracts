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


async function main() {
  const [deployer, kreator, kitten1, kitten2] = await ethers.getSigners();

  console.log("The deployer is -", deployer.address);

  // Deploy example contract addresses for development and testing purposes, comment out before testnet deployment
  // Or use your own addressess
  const _KittyPartyFactory = await ethers.getContractFactory("KittyPartyFactory");
  const Token = await ethers.getContractFactory("ERC20");


  let dai_address = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063";
  let kp_factory = "0x40f88fbFB3f53d297E09d460da87bD3eddDdf026";
  let yieldContract = "0xC1e9a3d2a6419A7eAcde2ae1cA1c6d0fc7bb3526";
  let winnerStrategyAddress = "0x12D160d081F0cA5D95B6cbf3fe32340920EF12Ea";

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
     durationInDays: 2,
     amountInDAIPerRound: ethers.utils.parseUnits("20"),
     partyName: ethers.utils.formatBytes32String("speed party"),
     daiAddress: dai_address,
     yieldContract: yieldContract
  };

  let KittyYieldArgs = {
    sellTokenAddress: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    lpTokenAddress: "0x27f8d03b3a2196956ed754badc28d73be8830a6e"
  };
    // await dai.connect(kreator).approve(kittyPartyFactory.address, (KittyInitiator.amountInDAIPerRound.div(10)).toString());
    // await delay(15000);
    // console.log("Approved DAI")
    // const instance = await kittyPartyFactory.connect(kreator).createKitty(KittyInitiator, KittyYieldArgs);
    // await delay(15000);
    // console.log("deployedKitty ...")

    let deployedKitty = await kittyPartyFactory.connect(kreator).getMyKitties(kreator.address);
    
    // await delay(3000);
    console.log('deployedKitty[deployedKitty.length - 1]::',JSON.stringify(deployedKitty[deployedKitty.length - 1]))
    const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
    let kittyPartyController = await _KittyPartyController.attach(deployedKitty[deployedKitty.length - 1]);

    let stage = await kittyPartyController.getStage();
    console.log('stage::', stage)

    //   // comment below for round 2 call
    // await dai.connect(kitten1).approve(deployedKitty[deployedKitty.length - 1],ethers.utils.parseUnits("20"));
    // await dai.connect(kitten2).approve(deployedKitty[deployedKitty.length - 1],ethers.utils.parseUnits("20"));

    // const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
    // const kittyPartyYieldGeneratorAave = await yielderFactory.attach(yieldContract);
    // await delay(20000);
      
    // await kittyPartyYieldGeneratorAave.setAllowanceDeposit(deployedKitty[deployedKitty.length - 1]);
    // await delay(20000);
    // console.log('depositAndAddKittenToParty::')
    
    //    // end comment below for round2 call

    // //comment below for round 1 call
    // await kittyPartyController.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
    // await delay(20000);

    // await kittyPartyController.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
    // console.log('depositAndAddKittenToParty 1/2..')

    // await kittyPartyController.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
    // console.log('depositAndAddKittenToParty 2/2')

    let getInternalStage = await kittyPartyController.kittyPartyControllerVars();

    // await network.provider.send("evm_increaseTime", [1*24*3600]);
    stage = await kittyPartyController.getStage();
    console.log('stage::', stage, getInternalStage);

    console.log('applyInitialVerification started..')

    //initiate the party
    await delay(20000);
    await kittyPartyController.connect(kreator).applyInitialVerification();

    console.log('applyInitialVerification completed..');
    stage = await kittyPartyController.getStage();
    console.log('stage::', stage)
  

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
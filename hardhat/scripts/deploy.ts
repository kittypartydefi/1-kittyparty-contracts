// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import  { config, ethers } from "hardhat";
import { Contract } from 'ethers';
import fs from 'fs';
let polygon =  require("../test/PolygonAddresses.ts");

import * as hre from "hardhat";

async function main() {
  const [deployer, kitten1, kitten2] = await ethers.getSigners();
  const KP_DAO_ADDRESS = "0x9CbeF40aEe5Eb4b541DA73409F8425A3aae5fd1e";
  console.log("The deployer address is " , deployer.address)
  const sellTokenAddress = polygon.aave.sellTokenAddress;
  const aaveContractAddress = polygon.aave.aaveContractAddress;
  const aaveDaiContractAddress = polygon.aave.aaveDaiContractAddress;
  const aaveRewardContractAddress = polygon.aave.aaveRewardContractAddress;
  // const KittyPartyTreasury = "0x67114a33CAe81D819AC1aF7290952236f05535C7";
  const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero ;
  
  // const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
  // const kittyPartyYieldGeneratorAave = await yielderFactory.deploy();
  // console.log("Deploying kittyPartyYieldGeneratorAave...", kittyPartyYieldGeneratorAave.address);

  // const WinnerStrategySingle = await ethers.getContractFactory('KittyPartyWinnerDistributeEqual');
  // const winnerStrategySingle = await WinnerStrategySingle.deploy();
  // console.log("Deploying winnerStrategySingle...", winnerStrategySingle.address);

  //TODO : Remove in production run
  // const _KittyPartyToken = await ethers.getContractFactory("KittyPartyToken");
  // const kittyPartyToken = await _KittyPartyToken.deploy();
  // const kptoken = await kittyPartyToken.deployed();

  // const KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  // const kittyParty = await KittyPartyController.deploy();
  // console.log("Deploying KittyPartyController Master...", kittyParty.address);
  // //For testing purposes deploy a local token and set it as DAI
  // const Token = await ethers.getContractFactory("ERC20");
  
  // const dai = {"address": polygon.aave.sellTokenAddress} 
  // console.log("Deploying Token...", dai.address);

  // const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
  // const kittyPartyAccountant = await _KittyPartyAccountant.deploy(KP_DAO_ADDRESS);
  // await kittyPartyAccountant.deployed();
  
  
  // const _Kittens = await ethers.getContractFactory("Kittens");
  // const kittens = await _Kittens.deploy();
  // await kittens.deployed();
  // console.log("Deploying Kittens...", kittens.address);
  // const _KittyPartyTreasury = await ethers.getContractFactory("KittyPartyTreasury");
  // const kittyPartyTreasury = await _KittyPartyTreasury.deploy();
  // await kittyPartyTreasury.deployed();
  // await kittyPartyTreasury.__KittyPartyTreasury_init(dai.address,kptoken.address, KP_DAO_ADDRESS, kittyPartyAccountant.address);
  // await kittyPartyToken.mint(kittyPartyTreasury.address, ethers.utils.parseUnits("1000000"))
  // await kittyPartyToken.mint(KP_DAO_ADDRESS, ethers.utils.parseUnits("1000000"))
  // await kittyPartyToken.grantRole(DEFAULT_ADMIN_ROLE, KP_DAO_ADDRESS);
  // await kittyPartyToken.grantRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", KP_DAO_ADDRESS);
  // // Deploy Keeper contract and set factory as SETTER_ROLE
  // const KittyPartyStateTransitionKeeper = await ethers.getContractFactory('KittyPartyStateTransitionKeeper');
  // const kittyPartyStateTransitionKeeper = await KittyPartyStateTransitionKeeper.deploy();
  // console.log("Deploying StateTransitionKeeper...", kittyPartyStateTransitionKeeper.address);
  // await kittyPartyStateTransitionKeeper.deployed();
  // const KittyPartyFactory = await ethers.getContractFactory("KittyPartyFactory");
  // const kittyPartyFactory = await KittyPartyFactory.deploy();
  // await kittyPartyFactory.initialize(KP_DAO_ADDRESS);
  // await kittyPartyFactory.setFactoryInit([kittyParty.address, kittyPartyAccountant.address, kittens.address, KP_DAO_ADDRESS, kittyPartyStateTransitionKeeper.address]);
  // console.log("Deploying kittyPartyFactory...", kittyPartyFactory.address);
  


  // await kittyPartyStateTransitionKeeper.grantRole("0x61c92169ef077349011ff0b1383c894d86c5f0b41d986366b58a6cf31e93beda", kittyPartyFactory.address);
  
  // //Transfer admin role to factory contract for accountant so that clones can be granted minter role
  // console.log("Transferring default admin role to factory", kittyPartyFactory.address, DEFAULT_ADMIN_ROLE);
  // await kittyPartyAccountant.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  
  // await kittens.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  // await kittyPartyAccountant.__KittyPartyAccountant_init(kittyPartyFactory.address);
  
  // await kittyPartyAccountant.setTreasury(kittyPartyTreasury.address);

  

  // // console.log("kittyPartyTreasury", kittyPartyTreasury.address);
  // console.log("kittyPartyAccountant", kittyPartyAccountant.address);

  // await kittyPartyYieldGeneratorAave.__KittyPartyYieldGeneratorAave_init("0x5f25817db84a441dd12bc35361a5f308889af99f");
  
  // await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);
  // await kittyPartyYieldGeneratorAave.setPlatformRewardContractAddress(aaveRewardContractAddress, polygon.aave.aaveRewardTokenContractAddress);

  return {
    // 'kittyPartyYieldGeneratorAave':kittyPartyYieldGeneratorAave.address,
          // 'winnerStrategySingle' : winnerStrategySingle.address,
          // 'kittyPartyController':kittyParty.address,
          // 'kittyPartyTreasury':kittyPartyTreasury.address,
          // 'kittyPartyToken':kittyPartyToken.address,
          // 'kittyPartyFactory':kittyPartyFactory.address,
          // 'kittens':kittens.address,
          // 'kittyPartyAccountant':kittyPartyAccountant.address, 
          'kittyPartyStateTransitionKeeper':"0xDA1eF38961f525Aa06910697cf50E6AcA8d9335B",
          'deployer':deployer.address};
  
  // return {'kittyPartyYieldGeneratorAave':"0x7403b835b4501Df689A2f65c79142f6D3b21Ff5D",
  //         'winnerStrategySingle' : "0x257C0a8Ff6453837ca5853B441CC3af0B4a9c506",
  //         'kittyPartyController':"0x97e374a7086A081072aC23DD3A3Bb687B43ff643",
  //         'kittyPartyTreasury':"",
  //         'kittyPartyToken':"0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
  //         'kittyPartyFactory':"0xCd889ADC03f808Fb7E79a3Ab24Ad568a1aC7a6Cc",
  //         'kittens':"0x0fA94CA13DA2533482BC3340425733Ad92Df78B0",
  //         'kittyPartyAccountant':"0xE7a693F5561BE32DF75f57Ba6a9844ffCadDeC62", 
  //         'kittyPartyStateTransitionKeeper':"0x0708eEA63fCF864D29FFdD18E02f0F9587185a90",
  //         'deployer':"0x9CbeF40aEe5Eb4b541DA73409F8425A3aae5fd1e"};

}

async function verify(contractAddress:string, ...args:Array<any>) {
  console.log("verifying", contractAddress, ...args);
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [
      ...args
    ],
  });
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
// async function test(){
//   await verify("0x8e17E366B5D9d665BdedCa341E349110ca3B34b3"); 

// }
// test();



  main()
  .then( async (deployedData) => {
    await delay(3000);
    // await verify(deployedData.kittyPartyYieldGeneratorAave); 
    // await verify(deployedData.winnerStrategySingle); 
    // await verify(deployedData.kittyPartyToken);
    // await verify(deployedData.kittyPartyController);
    // await verify(deployedData.kittyPartyTreasury);
    // await verify(deployedData.kittens);
    // await verify(deployedData.kittyPartyFactory);
    // await verify(deployedData.kittyPartyAccountant, "0x9CbeF40aEe5Eb4b541DA73409F8425A3aae5fd1e");
    await verify(deployedData.kittyPartyStateTransitionKeeper);
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
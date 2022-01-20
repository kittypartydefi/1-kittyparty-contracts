// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import  { config, ethers } from "hardhat";
import { Contract } from 'ethers';
import fs from 'fs';
let contractAddresses =  require("../test/ContractAddresses.ts");
import { 
  KittyPartyFactory,
} from '../src/types/index';
import * as hre from "hardhat";

async function main() {

  const [deployer] = await ethers.getSigners();
  const KP_DAO_ADDRESS = "0x9CbeF40aEe5Eb4b541DA73409F8425A3aae5fd1e";
  console.log("The deployer address is " , deployer.address)
  // const sellTokenAddress = contractAddresses.mumbai.sellTokenAddress;
  // const aaveContractAddress = contractAddresses.mumbai.aaveContractAddress;
  // const aaveDaiContractAddress = contractAddresses.mumbai.aaveDaiContractAddress;
  // const aaveRewardContractAddress = contractAddresses.mumbai.aaveRewardContractAddress;
  // const KPTTOKENADDRESS = "0x736034D46A8155D3cE699161156261917ca6cCD2";
  // const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero ;
  
  // const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
  // const kittyPartyYieldGeneratorAave = await yielderFactory.deploy();
  // console.log("Deploying kittyPartyYieldGeneratorAAve...", kittyPartyYieldGeneratorAave.address);

  // const WinnerStrategySingle = await ethers.getContractFactory('KittyPartyWinnerDistributeEqual');
  // const winnerStrategySingle = await WinnerStrategySingle.deploy();
  // console.log("Deploying winnerStrategySingle...", winnerStrategySingle.address);

  const KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  const kittyParty = await KittyPartyController.deploy();
  console.log("Deploying KittyPartyController Master...", kittyParty.address);

  // const dai = {"address": contractAddresses.mumbai.sellTokenAddress} 

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
  // await kittyPartyTreasury.__KittyPartyTreasury_init(dai.address,KPTTOKENADDRESS, KP_DAO_ADDRESS, kittyPartyAccountant.address);

  // // // Deploy Keeper contract and set factory as SETTER_ROLE
  // const KittyPartyStateTransitionKeeper = await ethers.getContractFactory('KittyPartyStateTransitionKeeper');
  // const kittyPartyStateTransitionKeeper = await KittyPartyStateTransitionKeeper.deploy();
  // console.log("Deploying StateTransitionKeeper...", kittyPartyStateTransitionKeeper.address);
  // await kittyPartyStateTransitionKeeper.deployed();
  // const proxyKittyPartyFactory = await ethers.getContractFactory("KittyPartyFactory");
  // const kittyPartyFactory = await proxyKittyPartyFactory.deploy();
  // await kittyPartyFactory.initialize(KP_DAO_ADDRESS);

  // let kpFactory = {
  //   "tomCatContract": kittyParty.address,
  //   "accountantContract": kittyPartyAccountant.address,
  //   "litterAddress": kittens.address,
  //   "daoTreasuryContract": KP_DAO_ADDRESS,
  //   "keeperContractAddress": kittyPartyStateTransitionKeeper.address
  // };
  
  // await kittyPartyFactory.setFactoryInit(kpFactory);
  // console.log("Deploying kittyPartyFactory...", kittyPartyFactory.address);
  
  // await kittyPartyStateTransitionKeeper.grantRole("0x61c92169ef077349011ff0b1383c894d86c5f0b41d986366b58a6cf31e93beda", kittyPartyFactory.address);
  
  // // //Transfer admin role to factory contract for accountant so that clones can be granted minter role
  // console.log("Transferring default admin role to factory", kittyPartyFactory.address, DEFAULT_ADMIN_ROLE);
  // await kittyPartyAccountant.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  
  // await kittens.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  // await kittyPartyAccountant.__KittyPartyAccountant_init(kittyPartyFactory.address);
  
  // await kittyPartyAccountant.setTreasury(kittyPartyTreasury.address);

  

  // // // console.log("kittyPartyTreasury", kittyPartyTreasury.address);
  // console.log("kittyPartyAccountant", kittyPartyAccountant.address);

  // await kittyPartyYieldGeneratorAave.__KittyPartyYieldGeneratorAave_init(kittyPartyTreasury.address);
  
  // await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);
  // await kittyPartyYieldGeneratorAave.setPlatformRewardContractAddress(aaveRewardContractAddress, contractAddresses.mumbai.aaveRewardTokenContractAddress);

  return {
    // 'kittyPartyYieldGeneratorAave':kittyPartyYieldGeneratorAave.address,
    //       'winnerStrategySingle' : winnerStrategySingle.address,
          'kittyPartyController':kittyParty.address,
          // 'kittyPartyTreasury':kittyPartyTreasury.address,
          // 'kittyPartyFactory':kittyPartyFactory.address,
          // 'kittens':kittens.address,
          // 'kittyPartyAccountant':kittyPartyAccountant.address, 
          // 'kittyPartyStateTransitionKeeper':kittyPartyStateTransitionKeeper.address,
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

// async function verifySingle(){
//   await verify("0x884d9ad451981efb982fa8777fd8acc994badcf0"); 

// }
// verifySingle();



  main()
  .then( async (deployedData) => {
    await delay(50000);
    // await verify(deployedData.kittyPartyYieldGeneratorAave); 
    // await verify(deployedData.winnerStrategySingle);
    await verify(deployedData.kittyPartyController);
    // await verify(deployedData.kittyPartyTreasury);
    // await verify(deployedData.kittens);
    // await verify(deployedData.kittyPartyFactory);
    // await verify(deployedData.kittyPartyAccountant, "0x9CbeF40aEe5Eb4b541DA73409F8425A3aae5fd1e");
    // await verify(deployedData.kittyPartyStateTransitionKeeper);
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
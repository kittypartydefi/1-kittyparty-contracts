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
  KittyPartyFactory, KittyPartyStateTransition__factory,
} from '../src/types/index';
import * as hre from "hardhat";

//Select network to deploy contracts
const deployNetwork = hre.network.name;


const KP_DAO_ADDRESS = "0xc044871dBbdf65D708c2Db406DED02258f19A96B"; //later handover to 0x56322a77E3fD213fA0aB3165C5078a9f197204C4
const sellTokenAddress = contractAddresses[deployNetwork].sellTokenAddress;
const aaveContractAddress = contractAddresses[deployNetwork].aaveContractAddress;
const aaveDaiContractAddress = contractAddresses[deployNetwork].aaveDaiContractAddress;
const aaveRewardContractAddress = contractAddresses[deployNetwork].aaveRewardContractAddress;
const aaveRewardTokenContractAddress = contractAddresses[deployNetwork].aaveRewardTokenContractAddress;

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("The deployer address is " , deployer.address);
  
  // const KPTTOKENADDRESS = "0x7d369731e3d7f86417aa86ef4be26e309080bd2f";
  // const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero ;
  
  // const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
  // const kittyPartyYieldGeneratorAave = await yielderFactory.deploy();
  // console.log("Deploying kittyPartyYieldGeneratorAave...", kittyPartyYieldGeneratorAave.address);

  // const WinnerStrategySingle = await ethers.getContractFactory('KittyPartyWinnerDistributeEqual');
  // const winnerStrategySingle = await WinnerStrategySingle.deploy();
  // console.log("Deploying winnerStrategySingle...", winnerStrategySingle.address);

  // const KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  // const kittyParty = await KittyPartyController.deploy();
  // console.log("Deploying KittyPartyController Master...", kittyParty.address);

  // const dai = {"address": sellTokenAddress}; 

  // const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
  // const kittyPartyAccountant = await _KittyPartyAccountant.deploy("0x56322a77E3fD213fA0aB3165C5078a9f197204C4");
  // await kittyPartyAccountant.deployed();  
  
  // const _Kittens = await ethers.getContractFactory("Kittens");
  // const kittens = await _Kittens.deploy();
  // await kittens.deployed();
  // console.log("Deploying Kittens...", kittens.address);
  // const _KittyPartyTreasury = await ethers.getContractFactory("KittyPartyTreasury");
  // const kittyPartyTreasury = await _KittyPartyTreasury.deploy();
  // await kittyPartyTreasury.deployed();
  // await kittyPartyTreasury.__KittyPartyTreasury_init(dai.address, KPTTOKENADDRESS, KP_DAO_ADDRESS, kittyPartyAccountant.address);

  // // Deploy Keeper contract and set factory as SETTER_ROLE
  const KittyPartyStateTransitionKeeper = await ethers.getContractFactory('KittyPartyStateTransitionKeeper');
  const kittyPartyStateTransitionKeeper = await KittyPartyStateTransitionKeeper.deploy();
  console.log("Deploying StateTransitionKeeper...", kittyPartyStateTransitionKeeper.address);
  await kittyPartyStateTransitionKeeper.deployed();
  const proxyKittyPartyFactory = await ethers.getContractFactory("KittyPartyFactory");
  const kittyPartyFactory = await proxyKittyPartyFactory.attach("0x76D18b4173bB1d34FF6Ebe555439c75D57299D70");
  // await kittyPartyFactory.initialize(KP_DAO_ADDRESS);
  // await delay(20000);

  let kpFactory = {
    "tomCatContract": "0x9232f5f87b696Fc5a184Fc2AB0bC0E9F2d20C7bE",
    "accountantContract": "0x28d0d56C2e78E53579997FE29265087CB9d6a011",
    "litterAddress": "0x229A6C7CA91a710493016651d0FE221EbE5F5287",
    "daoTreasuryContract": KP_DAO_ADDRESS,
    "keeperContractAddress": kittyPartyStateTransitionKeeper.address
  };
  
  await kittyPartyFactory.setFactoryInit(kpFactory);
  // console.log("Deploying kittyPartyFactory...", kittyPartyFactory.address);
  
  await kittyPartyStateTransitionKeeper.grantRole("0x61c92169ef077349011ff0b1383c894d86c5f0b41d986366b58a6cf31e93beda", "0x76D18b4173bB1d34FF6Ebe555439c75D57299D70");
  
  // // //Transfer admin role to factory contract for accountant so that clones can be granted minter role
  // console.log("Transferring default admin role to factory", kittyPartyFactory.address, DEFAULT_ADMIN_ROLE);
  // await kittyPartyAccountant.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  
  // await kittens.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  // await kittyPartyAccountant.__KittyPartyAccountant_init(kittyPartyFactory.address);
  
  // await kittyPartyAccountant.setTreasury(kittyPartyTreasury.address);  

  // console.log("kittyPartyTreasury", kittyPartyTreasury.address);
  // console.log("kittyPartyAccountant", kittyPartyAccountant.address);

  // await kittyPartyYieldGeneratorAave.__KittyPartyYieldGeneratorAave_init(kittyPartyTreasury.address);
  // await kittyPartyFactory.setApprovedStrategy(kittyPartyYieldGeneratorAave.address);
  // console.log("setApprovedStrategy");
  
  // await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);
  // await kittyPartyYieldGeneratorAave.setPlatformRewardContractAddress(aaveRewardContractAddress, aaveRewardTokenContractAddress);
  // console.log("setPlatformRewardContractAddress");

  return {
    // 'kittyPartyYieldGeneratorAave':kittyPartyYieldGeneratorAave.address,
    // 'winnerStrategySingle' : winnerStrategySingle.address,
    // 'kittyPartyController':kittyParty.address,
    // 'kittyPartyTreasury':kittyPartyTreasury.address,
    // 'kittyPartyFactory':kittyPartyFactory.address,
    // 'kittens':kittens.address,
    // 'kittyPartyAccountant':kittyPartyAccountant.address, 
    'kittyPartyStateTransitionKeeper':kittyPartyStateTransitionKeeper.address,
    // 'deployer':deployer.address
  };
  
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
    // await verify(deployedData.kittyPartyController);
    // await verify(deployedData.kittyPartyTreasury);
    // await verify(deployedData.kittens);
    // await verify(deployedData.kittyPartyFactory);
    // await verify(deployedData.kittyPartyAccountant, "0x56322a77E3fD213fA0aB3165C5078a9f197204C4");
    await verify(deployedData.kittyPartyStateTransitionKeeper);
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
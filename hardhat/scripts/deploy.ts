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
  const KP_DAO_ADDRESS = "0x56322a77E3fD213fA0aB3165C5078a9f197204C4";
  console.log("The deployer address is " , deployer.address)
  const sellTokenAddress = polygon.aave.sellTokenAddress;
  const aaveContractAddress = polygon.aave.aaveContractAddress;
  const aaveDaiContractAddress = polygon.aave.aaveDaiContractAddress;
  const aaveRewardContractAddress = polygon.aave.aaveRewardContractAddress;
  const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero ;
  
  const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
  const kittyPartyYieldGeneratorAave = await yielderFactory.deploy();
  console.log("Deploying kittyPartyYieldGeneratorAave...", kittyPartyYieldGeneratorAave.address);

  const WinnerStrategySingle = await ethers.getContractFactory('KittyPartyWinnerDistributeEqual');
  const winnerStrategySingle = await WinnerStrategySingle.deploy();
  console.log("Deploying winnerStrategySingle...", winnerStrategySingle.address);

  //TODO : Remove in production run
  const _KittyPartyToken = await ethers.getContractFactory("KittyPartyToken");
  const kittyPartyToken = await _KittyPartyToken.deploy();
  const kptoken = await kittyPartyToken.deployed();

  const KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  const kittyParty = await KittyPartyController.deploy();
  console.log("Deploying KittyPartyController Master...", kittyParty.address);
  //For testing purposes deploy a local token and set it as DAI
  const Token = await ethers.getContractFactory("ERC20");
  
  const dai = {"address": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"} 
  console.log("Deploying Token...", dai.address);

  const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
  const kittyPartyAccountant = await _KittyPartyAccountant.deploy();
  await kittyPartyAccountant.deployed();
  
  
  const _Kittens = await ethers.getContractFactory("Kittens");
  const kittens = await _Kittens.deploy();
  await kittens.deployed();
  console.log("Deploying Kittens...", kittens.address);
  const _KittyPartyTreasury = await ethers.getContractFactory("KittyPartyTreasury");
  const kittyPartyTreasury = await _KittyPartyTreasury.deploy();
  await kittyPartyTreasury.deployed();
  await kittyPartyTreasury.__KittyPartyTreasury_init(dai.address,kptoken.address, KP_DAO_ADDRESS, kittyPartyAccountant.address);
  await kittyPartyToken.mint(kittyPartyTreasury.address, ethers.utils.parseUnits("1000000"))
  await kittyPartyToken.mint(KP_DAO_ADDRESS, ethers.utils.parseUnits("1000000"))
  await kittyPartyToken.grantRole(DEFAULT_ADMIN_ROLE, KP_DAO_ADDRESS);
  await kittyPartyToken.grantRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", KP_DAO_ADDRESS);

  const KittyPartyFactory = await ethers.getContractFactory("KittyPartyFactory");
  const kittyPartyFactory = await KittyPartyFactory.deploy([kittyParty.address, kittyPartyAccountant.address, kittens.address, "0x56322a77E3fD213fA0aB3165C5078a9f197204C4", deployer.address]);
  console.log("Deploying kittyPartyFactory...", kittyPartyFactory.address);
  
  
  //Transfer admin role to factory contract for accountant so that clones can be granted minter role
  console.log("Transferring default admin role to factory", kittyPartyFactory.address, DEFAULT_ADMIN_ROLE);
  await kittyPartyAccountant.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  
  await kittens.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
  await kittyPartyAccountant.__KittyPartyAccountant_init(kittyPartyFactory.address);
  
  await kittyPartyAccountant.setTreasury(kittyPartyTreasury.address);

  

  console.log("kittyPartyTreasury", kittyPartyTreasury.address);
  console.log("kittyPartyAccountant", kittyPartyAccountant.address);

  await kittyPartyYieldGeneratorAave.__KittyPartyYieldGeneratorAave_init(kittyPartyTreasury.address);
  
  await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);
  await kittyPartyYieldGeneratorAave.setPlatformRewardContractAddress(aaveRewardContractAddress);

  return {'kittyPartyYieldGeneratorAave':kittyPartyYieldGeneratorAave.address,
          'winnerStrategySingle' : winnerStrategySingle.address,
          'kittyPartyToken':kptoken.address,
          'kittyPartyController':kittyParty.address,
          'kittyPartyTreasury':kittyPartyTreasury.address,
          'kittyPartyFactory':kittyPartyFactory.address,
          'kittens':kittens.address,
          'kittyPartyAccountant':kittyPartyAccountant.address, 
          'deployer':deployer.address};
  

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

  main()
  .then( async (deployedData) => {
    await delay(3000);
    await verify(deployedData.kittyPartyYieldGeneratorAave); 
    await verify(deployedData.winnerStrategySingle); 
    await verify(deployedData.kittyPartyToken);
    await verify(deployedData.kittyPartyController);
    await verify(deployedData.kittyPartyTreasury);
    await verify(deployedData.kittens);
    await verify(deployedData.kittyPartyFactory, [deployedData.kittyPartyController, 
                                                  deployedData.kittyPartyAccountant, deployedData.kittens, 
                                                 "0x56322a77E3fD213fA0aB3165C5078a9f197204C4", deployedData.deployer]);
    await verify(deployedData.kittyPartyAccountant);
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
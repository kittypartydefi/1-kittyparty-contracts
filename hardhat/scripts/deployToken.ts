// Deploys KPT Token to ethereum mainnet
import  { config, ethers } from "hardhat";
import { Contract } from 'ethers';
import fs from 'fs';

import * as hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const KP_DAO_ADDRESS = "0xD832235BcF4Faa22e5752a266737d1E82b84E6c3";
  console.log("The deployer address is " , deployer.address)
  const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero ;
  
  const _KittyPartyToken = await ethers.getContractFactory("KittyPartyToken");
  const kittyPartyToken = await _KittyPartyToken.deploy();
  const kptoken = await kittyPartyToken.deployed();
  
  await kittyPartyToken.mint(KP_DAO_ADDRESS, ethers.utils.parseUnits("1000000"))
  await kittyPartyToken.grantRole(DEFAULT_ADMIN_ROLE, KP_DAO_ADDRESS);
  await kittyPartyToken.grantRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", KP_DAO_ADDRESS);
  
  return {    
      'kittyPartyToken':kittyPartyToken.address,
      'deployer':deployer.address
          };
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

async function verifySingle(){
  await verify("0x444f20A5d578862bf84B6d14EC3CA0c8Be8e555F"); 

}
verifySingle();



  // main()
  // .then( async (deployedData) => {
  //   await delay(50000);
  //   await verify(deployedData.kittyPartyToken);
  //   process.exit(0)
  // })
  // .catch(error => {
  //   console.error(error);
  //   process.exit(1);
  // });
import { Wallet } from 'ethers';
// import { Signer } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import { Contract } from "@ethersproject/contracts";
import { 
  ethers, 
  waffle, 
  network 
} from "hardhat";
import { 
  KittyPartyYieldGeneratorAave, 
  KittyPartyTreasury
} from '../src/types/index';



let kittyPartyTreasury: KittyPartyTreasury;

const sellTokenAddress = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';
const aaveContractAddress = "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf";
const aaveDaiContractAddress = "0x27f8d03b3a2196956ed754badc28d73be8830a6e";
const aaveRewardContractAddress = "0x357D51124f59836DeD84c8a1730D72B749d8BC23";
const aaveRewardTokenContractAddress = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";


// Start test block
describe('Kitty Party Aave Yield Generator can zap in and out', function () {

let addresses =  require("./ContractAddresses.ts");


let kittyPartyTreasury: KittyPartyTreasury;

const sellTokenAddress = addresses.polygon.sellTokenAddress;
const aaveContractAddress = addresses.polygon.aaveContractAddress;
const aaveDaiContractAddress = addresses.polygon.aaveDaiContractAddress;
const aaveRewardContractAddress = addresses.polygon.aaveRewardContractAddress;
const aaveRewardTokenContractAddress = addresses.polygon.aaveRewardTokenContractAddress;


// Start test block
describe('Kitty Party Aave Yield Generator can deposit and withdraw', function () {

  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let kittyPartyYieldGeneratorAave: KittyPartyYieldGeneratorAave;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
    const kittyPartyYieldGeneratorAave = await yielderFactory.deploy() as KittyPartyYieldGeneratorAave;
    const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero ;

    //init the zapper contract and set the party etc...
    await kittyPartyYieldGeneratorAave.__KittyPartyYieldGeneratorAave_init("0xc044871dBbdf65D708c2Db406DED02258f19A96B");
    //Transfer admin role to yielder contract for accountant so that clones can be granted minter role
    return kittyPartyYieldGeneratorAave;    
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;
  let daiFactory: any;

  before('create fixture loader', async () => {
    [wallet, other, kitten1, kitten2] = await (ethers as any).getSigners();
    loadFixture = createFixtureLoader([wallet, other, kitten1, kitten2]);    
  })

  beforeEach('deploy factory', async () => {
    kittyPartyYieldGeneratorAave = await loadFixture(fixture);
  })


  // Test case
it('can deposit money in', async function () {
/**
 * So we need to first do an approval transaction 
 * then we need to call the zap in transaction
 * we can check if the transaction was successfully completed
 * we can also check if the v2 token amount has increased and dai amount has decreased
 * A. Can we deposit and can we withdraw
 */
  const Token = await ethers.getContractFactory("ERC20");
  daiFactory = await Token.attach(sellTokenAddress);

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0xc044871dBbdf65D708c2Db406DED02258f19A96B"],
  });

  const real_wallet = await ethers.getSigner("0xc044871dBbdf65D708c2Db406DED02258f19A96B");
  let myBalance = await daiFactory.balanceOf(real_wallet.address);

  const depositReceiptToken = await ethers.getContractFactory("ERC20");
  let daiDepositReceiptToken = await depositReceiptToken.attach(aaveDaiContractAddress);

  let ygBalance = await daiDepositReceiptToken.balanceOf(kittyPartyYieldGeneratorAave.address);

  console.log("ygBalance  - ",  ethers.utils.formatEther(ygBalance))
  console.log("Dai Balance - ",  ethers.utils.formatEther(myBalance))


  await kittyPartyYieldGeneratorAave.setPartyInfo(sellTokenAddress, aaveDaiContractAddress);
  await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);
  
  await kittyPartyYieldGeneratorAave.setAllowanceDeposit(wallet.address);

  const allowance = await daiFactory.allowance(kittyPartyYieldGeneratorAave.address, aaveContractAddress);
  console.log("allowance kittyPartyYieldGeneratorAave - ", ethers.utils.formatEther(allowance) );
  await daiFactory.connect(real_wallet).transfer( kittyPartyYieldGeneratorAave.address, ethers.utils.parseEther("10"))

  await kittyPartyYieldGeneratorAave.createLockedValue('0x00');

  ygBalance = await daiDepositReceiptToken.balanceOf(kittyPartyYieldGeneratorAave.address);

  console.log("ygBalance after - ",  ethers.utils.formatEther(ygBalance))
  
  // expect(allowance.toString()).to.equal("0xc044871dBbdf65D708c2Db406DED02258f19A96B");
  //once allowance is set lets put some DAI into it

  
  }).timeout(80000);

    // Test case
  it('can do a withdraw', async function () {
    const Token = await ethers.getContractFactory("ERC20");
    daiFactory = await Token.attach(sellTokenAddress);
  
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xc044871dBbdf65D708c2Db406DED02258f19A96B"],
    });
  
    const real_wallet = await ethers.getSigner("0xc044871dBbdf65D708c2Db406DED02258f19A96B");

    let myBalance = await daiFactory.balanceOf(real_wallet.address);

  
    const depositReceiptToken = await ethers.getContractFactory("ERC20");
    let daiDepositReceiptToken = await depositReceiptToken.attach(aaveDaiContractAddress);
    const wmaticToken = await ethers.getContractFactory("ERC20");
    let wmaticRewardToken = await wmaticToken.attach(aaveRewardTokenContractAddress);
  

    let ygBalance = await daiDepositReceiptToken.balanceOf(kittyPartyYieldGeneratorAave.address);

    let rwBalance = await wmaticRewardToken.balanceOf(real_wallet.address);
    console.log("rwBalance before withdraw - ",  ethers.utils.formatEther(rwBalance))
  
    console.log("ygBalance  - ",  ethers.utils.formatEther(ygBalance))
    console.log("Dai Balance - ",  ethers.utils.formatEther(myBalance))
  
    await kittyPartyYieldGeneratorAave.setPartyInfo(sellTokenAddress, aaveDaiContractAddress);
    await kittyPartyYieldGeneratorAave.setPlatformRewardContractAddress(aaveRewardContractAddress,sellTokenAddress);// here later replace sellTokenAddress with reward Token address
    await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);
    await kittyPartyYieldGeneratorAave.setAllowanceDeposit(wallet.address);
  
    const allowance = await daiFactory.allowance(kittyPartyYieldGeneratorAave.address, aaveContractAddress);

    console.log("allowance kittyPartyYieldGeneratorAave - ", ethers.utils.formatEther(allowance) );
    await daiFactory.connect(real_wallet).transfer( kittyPartyYieldGeneratorAave.address, ethers.utils.parseEther("10"))
  
   await kittyPartyYieldGeneratorAave.createLockedValue('0x00');
   myBalance = await daiFactory.balanceOf(real_wallet.address);
   console.log("Dai Balance before withdraw - ",  ethers.utils.formatEther(myBalance))

    ygBalance = await daiDepositReceiptToken.balanceOf(kittyPartyYieldGeneratorAave.address);
    console.log("ygBalance before withdraw - ",  ethers.utils.formatEther(ygBalance));


    rwBalance = await wmaticRewardToken.balanceOf(real_wallet.address);
    console.log("rwBalance before withdraw - ",  ethers.utils.formatEther(rwBalance))


    
    // expect(allowance.toString()).to.equal("0xc044871dBbdf65D708c2Db406DED02258f19A96B");
    //once allowance is set lets put some DAI into it


   await network.provider.send("evm_increaseTime", [6000*6000]);
   await kittyPartyYieldGeneratorAave.unwindLockedValue('0x00');

     
   ygBalance = await daiDepositReceiptToken.balanceOf(kittyPartyYieldGeneratorAave.address);
   console.log("ygBalance after withdraw - ",  ethers.utils.formatEther(ygBalance));

    myBalance = await daiFactory.balanceOf(real_wallet.address);
    console.log("Dai Balance after withdraw - ",  ethers.utils.formatEther(myBalance))

    rwBalance = await wmaticRewardToken.balanceOf(real_wallet.address);
    console.log("rwBalance after withdraw - ",  ethers.utils.formatEther(rwBalance))
  
  }).timeout(80000); 
 
});
});
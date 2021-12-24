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
  KittyPartyYieldGeneratorZapper, 
  KittyPartyTreasury
} from '../src/types/index';


let kittyPartyTreasury: KittyPartyTreasury;

const testAddresses = [
  '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a',
  '0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B',
  '0xE61A17362BEcE0764C641cd449B4c56150c99c80'
];

const sellTokenAddress = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';
const poolAddress = '0x59153f27eefe07e5ece4f9304ebba1da6f53ca88';
const zapContractAddress = "0xF231be40d73a9E73d859955344A4fF74f448dF34";


// Start test block
describe('Kitty Party Zapper Yield Generator can zap in and out', function () {
  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let kittyPartyYieldGeneratorZapper: KittyPartyYieldGeneratorZapper;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorZapper');
    const kittyPartyYieldGeneratorZapper = await yielderFactory.deploy() as KittyPartyYieldGeneratorZapper;
    const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero ;

    //init the zapper contract and set the party etc...
    await kittyPartyYieldGeneratorZapper.__KittyPartyYieldGeneratorZapper_init("0xf88e8857cd5BA7A3762f71acb12781DDD412d0E2");
    //Transfer admin role to yielder contract for accountant so that clones can be granted minter role
    return kittyPartyYieldGeneratorZapper;    
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;
  let daiFactory: any;

  before('create fixture loader', async () => {
    [wallet, other, kitten1, kitten2] = await (ethers as any).getSigners();
    loadFixture = createFixtureLoader([wallet, other, kitten1, kitten2]);    
  })

  beforeEach('deploy factory', async () => {
    kittyPartyYieldGeneratorZapper = await loadFixture(fixture);
  })

  // Test case
  xit('can do a zap in', async function () {
/**
 * So we need to first do an approval transaction 
 * then we need to call the zap in transaction
 * we can check if the transaction was successfully completed
 * we can also check if the v2 token amount has increased and dai amount has decreased
 * A. Can we deposit and can we withdraw
 */
  await kittyPartyYieldGeneratorZapper.setPartyInfo(sellTokenAddress, poolAddress);
  // await kittyPartyYieldGeneratorZapper.setZapContractAddress(zapContractAddress);
  // await kittyPartyYieldGeneratorZapper.setAllowance();
  const Token = await ethers.getContractFactory("DAI");
  daiFactory = await Token.attach(sellTokenAddress);
  const allowance = await daiFactory.allowance(kittyPartyYieldGeneratorZapper.address, zapContractAddress);
  expect(allowance.toString()).to.equal("340282366920938463463374607431768211455");
  });

    // Test case
  xit('can do a zap out', async function () {
  /**
   * So we need to first do an approval transaction 
   * then we need to call the zap in transaction
   * we can check if the transaction was successfully completed
   * Once we do zap in, after few blocks we should be able to do a zap out
   * We can check whether the txn was successful and whether the v2 tokens were zapped out
   */
  }); 
 
});
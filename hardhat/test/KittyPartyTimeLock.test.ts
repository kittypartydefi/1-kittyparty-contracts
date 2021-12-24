import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle } from "hardhat";
// import { Signer } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ERC20, 
  KittyPartyGuardian,
  KittyPartyAccountant
} from '../src/types/index';


describe('Kitty Party Guardian can guard the party verse', function () {
  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let kittyPartyGuardian: KittyPartyGuardian;
  let kittyPartyAccountant: KittyPartyAccountant;
  let daiFactory: any;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const kpGuardian = await ethers.getContractFactory('KittyPartyGuardian');
    
    const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
    kittyPartyAccountant = await _KittyPartyAccountant.deploy() as KittyPartyAccountant;
    await kittyPartyAccountant.deployed();
    return (await kpGuardian.deploy()) as KittyPartyGuardian;
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;

  before('create fixture loader', async () => {
    [wallet, other, kitten1, kitten2] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other, kitten1, kitten2])
    const Token = await ethers.getContractFactory("DAI");
    daiFactory = await Token.deploy();
  })

  beforeEach('deploy kittyPartyGuardian', async () => {
    kittyPartyGuardian = await loadFixture(fixture)
  })
  // Test case

  xit('Only deployer can create the lock', async function () {});
  xit('Lock should be open in time', async function () {});
  xit('Lock should not be claimable by beneficiary before lock finishes', async function () {});
  xit('Lock should not be claimable by anyone other than beneficiary after lock finishes', async function () {});
  xit('Lock should not be claimable by anyone other than beneficiary before lock finishes', async function () {});
  xit('Lock should not have more than the initial amount', async function () {});
});

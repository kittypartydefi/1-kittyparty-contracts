import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ERC20,
  KittyPartyAccountant
} from '../src/types/index';


describe.skip('Kitty Party Guardian can guard the party verse', function () {
  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let kittyPartyAccountant: KittyPartyAccountant;
  let daiFactory: any;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
    return (await _KittyPartyAccountant.deploy()) as KittyPartyAccountant;
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;

  before('create fixture loader', async () => {
    [wallet, other, kitten1, kitten2] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other, kitten1, kitten2])
    const Token = await ethers.getContractFactory("DAI");
    daiFactory = await Token.deploy();
  })

  beforeEach('deploy kittyPartyAccountant', async () => {
    kittyPartyAccountant = await loadFixture(fixture)
  })
  // Test case

  xit('cannot verify kitten if approval not given and throws error', async function () {
  });
});

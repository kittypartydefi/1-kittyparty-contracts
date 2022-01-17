import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ERC20,
  KittyPartyAccountant
} from '../src/types/index';


describe('Kitty Party Accountant Init', function () {
  let wallet: Wallet, 
      daoAddress: Wallet, 
      factory: Wallet, 
      kitten2: Wallet;
  let kittyPartyAccountant: KittyPartyAccountant;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
    return (await _KittyPartyAccountant.deploy(daoAddress.address)) as KittyPartyAccountant;
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;

  before('create fixture loader', async () => {
    [wallet, daoAddress, factory, kitten2] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, daoAddress, factory, kitten2])
  })

  beforeEach('deploy kittyPartyAccountant', async () => {
    kittyPartyAccountant = await loadFixture(fixture)
  })
  // Test case

  it('can initialize the contract', async function () {
    kittyPartyAccountant.__KittyPartyAccountant_init(factory.address)
  });
  it('cannot reinit the contract', async function () {
    expect(kittyPartyAccountant.__KittyPartyAccountant_init(factory.address)).to.be.revertedWith("Contract is already initialized");
  });
});

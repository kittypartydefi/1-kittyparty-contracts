import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle } from "hardhat";
// import { Signer } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ERC20, 
  KittyPartyController, 
  KittyPartyAccountant 
} from '../src/types/index';


// In each block deploy different options
// Check that other types dont work either now or in future
describe.skip('Kitty Party Option of one winner works as intended', function () {
  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let controller: KittyPartyController;
  let kittyPartyAccountant: KittyPartyAccountant;
  let daiFactory: any;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const kpOptions = await ethers.getContractFactory('KittyPartyController');
    return (await kpOptions.deploy()) as KittyPartyController;
    const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
    kittyPartyAccountant = await _KittyPartyAccountant.deploy() as KittyPartyAccountant;
    await kittyPartyAccountant.deployed();
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;

  before('create fixture loader', async () => {
    [wallet, other, kitten1, kitten2] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other, kitten1, kitten2])
    const Token = await ethers.getContractFactory("DAI");
    daiFactory = await Token.deploy();
  })

  beforeEach('deploy KittyPartyController', async () => {
    controller = await loadFixture(fixture)
  })
  // Test case

  xit('cannot verify kitten if approval not given and throws error', async function () {
    expect((await controller.internalState())).to.equal(false);
    let initialOptionsForParty = {
      partyName: 'og',
      amountInDAIPerRound: 10,
      daiAddress: daiFactory.address,
      durationInDays: 1,
      winningStrategy: 1,
      vrfEnabled: false,
      yieldContract: other.address,
      timeToCollection: 1,
      maxKittens: 400,
    };
    let initializedController = (
      await controller.initialize(
        initialOptionsForParty, 
        kittyPartyAccountant.address, 
        other.address, 
        wallet.address, 
        other.address, 
        other.address, 
        0
      )
    );

    expect((await controller.internalState())).to.equal(true);
    await daiFactory.transfer(kitten1.address, ethers.utils.parseUnits("30"));
    await daiFactory.transfer(kitten2.address, ethers.utils.parseUnits("30"));
    let bal = await daiFactory.balanceOf(kitten2.address);
    await controller.setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
    
    await expect(
      controller.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"))
    ).to.be.revertedWith("Please approve the transfer amount");
  });

  xit('can list all the kittens that belong to the party', async function () {
    await daiFactory.transfer(controller.address, ethers.utils.parseUnits("30000"));
    let bal = await daiFactory.balanceOf(controller.address);
    console.log(bal)
  });

  xit('can transition between all the rounds', async function () {
    await daiFactory.transfer(controller.address, ethers.utils.parseUnits("30000"));
    let bal = await daiFactory.balanceOf(controller.address);
    console.log(bal)
  });

  xit('can transition between all the rounds', async function () {
    await daiFactory.transfer(controller.address, ethers.utils.parseUnits("30000"));
    let bal = await daiFactory.balanceOf(controller.address);
    console.log(bal)
  });

  xit('will not accept kittens once rounds have started', async function () {
    await daiFactory.transfer(controller.address, ethers.utils.parseUnits("30000"));
    let bal = await daiFactory.balanceOf(controller.address);
    console.log(bal)
  });

  xit('will finish after X rounds', async function () {
    await daiFactory.transfer(controller.address, ethers.utils.parseUnits("30000"));
    let bal = await daiFactory.balanceOf(controller.address);
    console.log(bal)
  });

});
import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle } from "hardhat";
// import { Signer } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ERC20, 
  KittyPartyGuardian,
  KittyPartyAccountant,
  KittyPartyToken
} from '../src/types/index';


describe('Kitty Party Guardian can guard the party verse', function () {
  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let kittyPartyGuardian: KittyPartyGuardian;
  let kittyPartyAccountant: KittyPartyAccountant;
  let kittyPartyToken: KittyPartyToken;
  let daiFactory: any;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const kpGuardian = await ethers.getContractFactory("KittyPartyGuardian");
    const _KittyPartyToken = await ethers.getContractFactory("KittyPartyToken");
    // REMEMBER TO GRANT THE ROLE OF GUARDIAN CREATOR
    kittyPartyToken = await _KittyPartyToken.deploy() as KittyPartyToken;
    const kpToken = await kittyPartyToken.deployed();
    const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
    kittyPartyAccountant = await _KittyPartyAccountant.deploy(kpToken.address) as KittyPartyAccountant;
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
    kittyPartyGuardian = await loadFixture(fixture);
  })
  
  // Test case
  it('should have correct name and symbol', async function () {
    expect(await kittyPartyGuardian.name()).to.equal("KittyPartyGuardian");
    expect(await kittyPartyGuardian.symbol()).to.equal("KPG");
  })

  it('Should be able to mint guardians', async function () {
    const supply = (await kittyPartyGuardian.totalSupply()).toString();
    const initialTokenSupply = parseInt(supply);
    await kittyPartyGuardian.safeMint(kitten1.address);
    const newSupply = (await kittyPartyGuardian.totalSupply()).toString();
    const finalTokenSupply = parseInt(newSupply);
    expect(finalTokenSupply - initialTokenSupply).to.equal(1);
  });

  xit('Should be able to mint 10000 guardians', async function () {});

  xit('Should be able to mint guardians 100 guardians first and then 9900 next', async function () {});
  xit('Should not be able to mint guardians after 10K minted', async function () {});

  it('Should not be able to burn guardians', async function () {
    await kittyPartyGuardian.safeMint(kitten1.address);
    await expect(
      kittyPartyGuardian.connect(kitten1).transferFrom(kitten1.address, "0x0000000000000000000000000000000000000000", 0)
    ).to.be.revertedWith("ERC721: transfer to the zero address");
  });

  xit('Should not be able to transfer stellar and galactic without tribute to guardian', async function () {});

  xit('Should be able to accept payment in terms of tributes in any erc20 tokens', async function () {});
});

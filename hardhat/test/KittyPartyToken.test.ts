import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle } from "hardhat";
// import { Signer } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ERC20,
  KittyPartyToken,
} from '../src/types/index';


describe('Kitty Party Token works as intended', function () {
  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let kittyPartyToken: KittyPartyToken;
  

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const _kittyPartyToken = await ethers.getContractFactory("KittyPartyToken");
    return (await _kittyPartyToken.deploy()) as KittyPartyToken;
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;

  before('create fixture loader', async () => {
    [wallet, other, kitten1, kitten2] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other, kitten1, kitten2])
    
  })

  beforeEach('deploy kittyPartyToken', async () => {
    kittyPartyToken = await loadFixture(fixture);
  })
  
  it('should have correct name, symbol, decimal and cap', async function () {
    expect(await kittyPartyToken.name()).to.equal("KittyPartyToken");
    expect(await kittyPartyToken.symbol()).to.equal("KPT");
    expect((await kittyPartyToken.decimals()).toString()).to.equal("18");
    const tokenCap = await kittyPartyToken.cap();
    expect(parseInt(ethers.utils.formatEther(tokenCap))).to.equal(133978713);
  })

  it('should allow owner to mint token', async function () {
    const supply = await kittyPartyToken.totalSupply();
    const initialTokenSupply = parseInt(ethers.utils.formatEther(supply));
    await kittyPartyToken.mint(wallet.address, ethers.utils.parseUnits("10"));
    const newSupply = await kittyPartyToken.totalSupply();
    const finalTokenSupply = parseInt(ethers.utils.formatEther(newSupply));
    expect(finalTokenSupply - initialTokenSupply).to.equal(10);
  })
  
  it('should not allow owner to mint more tokens if supply is exceeded', async function () {
    await kittyPartyToken.mint(kitten1.address, ethers.utils.parseUnits("133978713"));
    await expect(
      kittyPartyToken.mint(kitten2.address, ethers.utils.parseUnits("1"))
    ).to.be.revertedWith("ERC20Capped: cap exceeded");
  })

  it('should be able to transfer tokens between accounts', async function () {
    await kittyPartyToken.mint(kitten1.address, ethers.utils.parseUnits("10"));
    const iBalance = await kittyPartyToken.balanceOf(kitten2.address);
    const initialBalance = parseInt(ethers.utils.formatEther(iBalance));
    await kittyPartyToken.connect(kitten1).transfer(kitten2.address, ethers.utils.parseUnits("5"));
    const fBalance = await kittyPartyToken.balanceOf(kitten2.address);
    const finalBalance = parseInt(ethers.utils.formatEther(fBalance));
    expect(finalBalance - initialBalance).to.equal(5);
  })

  it('should not be able to send more than balance', async function () {
    await kittyPartyToken.mint(kitten1.address, ethers.utils.parseUnits("10"));
    await expect(
      kittyPartyToken.connect(kitten1).transfer(kitten2.address, ethers.utils.parseUnits("11"))
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  })

  it('only owner can mint more tokens', async function () {
    await expect(
      kittyPartyToken.connect(kitten1).mint(kitten1.address, ethers.utils.parseUnits("10"))
    ).to.be.revertedWith("");
  })

  it('should not be able to burn the token', async function () {
    await kittyPartyToken.mint(kitten1.address, ethers.utils.parseUnits("10"));
    await expect(
      kittyPartyToken.transfer("0x0000000000000000000000000000000000000000", ethers.utils.parseUnits("5"))
    ).to.be.revertedWith("ERC20: transfer to the zero address");
  })
});

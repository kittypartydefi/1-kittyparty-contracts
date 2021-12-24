import { Contract } from "@ethersproject/contracts";
import { Wallet  } from 'ethers'
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ethers, 
  waffle, 
  network
} from "hardhat";
import { 
  KittyPartyToken,
  KittyPartyFactory, 
  KittyPartyController, 
  KittyPartyAccountant, 
  Kittens, 
  KittyPartyTreasury,
  KittyPartyYieldGeneratorAave,
  DAI
} from '../src/types/index';


let kittyPartyToken: KittyPartyToken;
let kittyPartyController: KittyPartyController;
let kittyPartyAccountant: KittyPartyAccountant;
let kittyPartyYieldGeneratorAave: KittyPartyYieldGeneratorAave;
let kittens: Kittens;
let kittyPartyTreasury: KittyPartyTreasury;

const testAddresses = [
  '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a', 
  '0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B',
  '0xE61A17362BEcE0764C641cd449B4c56150c99c80'
];

let timeParameter = 24 * 60 * 60;
let polygon =  require("./PolygonAddresses.ts");
 
let dai_address = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063";
let daiFactory: DAI;
// Start test block
describe('Kitty Party Factory create new contract', function () {
  this.timeout(50000);
  let wallet: Wallet, 
      other: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;
  let factory: KittyPartyFactory;

  const createFixtureLoader = waffle.createFixtureLoader;
  const fixture = async () => {
    const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
    kittyPartyController = await _KittyPartyController.deploy() as KittyPartyController;
    await kittyPartyController.deployed();
    console.log("kittyPartyController tomcat deployed address:: ", kittyPartyController.address);

    const _KittyPartyToken = await ethers.getContractFactory("KittyPartyToken");
    kittyPartyToken = await _KittyPartyToken.deploy() as KittyPartyToken;
    const kptoken = await kittyPartyToken.deployed();
    console.log("kptoken deployed address:: ", kptoken.address);

    const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
    kittyPartyAccountant = await _KittyPartyAccountant.deploy(kptoken.address) as KittyPartyAccountant;
    await kittyPartyAccountant.deployed();
    console.log("kittyPartyAccountant  deployed address:: ", kittyPartyAccountant.address);

    const _Kittens = await ethers.getContractFactory("Kittens");
    kittens = await _Kittens.deploy() as Kittens;
    await kittens.deployed();
    console.log("kittens deployed address:: ", kittens.address);

    const Token = await ethers.getContractFactory("DAI");
    // daiFactory = await Token.deploy();
    // await daiFactory.deployed();


    daiFactory = await Token.attach(dai_address) as DAI;
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xf88e8857cd5BA7A3762f71acb12781DDD412d0E2"],
    });
  
    const real_wallet = await ethers.getSigner("0xf88e8857cd5BA7A3762f71acb12781DDD412d0E2");
    // const real_wallet = await ethers.getSigner(deployer.address);
    let myBalance = await daiFactory.balanceOf(real_wallet.address);
    console.log(myBalance);
    await daiFactory.connect(real_wallet).transfer(wallet.address, ethers.utils.parseUnits("30"));
    await daiFactory.connect(real_wallet).transfer(kitten1.address, ethers.utils.parseUnits("30"));
    await daiFactory.connect(real_wallet).transfer(kitten2.address, ethers.utils.parseUnits("30"));




    const _KittyPartyTreasury = await ethers.getContractFactory("KittyPartyTreasury");
    kittyPartyTreasury = await _KittyPartyTreasury.deploy() as KittyPartyTreasury;
    await kittyPartyTreasury.deployed();
    await kittyPartyTreasury.__KittyPartyTreasury_init(daiFactory.address, kittyPartyAccountant.address);
    //SEND SOME MONEY TO THE TREASURY CONTRACT ( IN LIVE THE YIELD CONTRACT WILL SEND, FOR TEST SEND MANUALLY)
    await daiFactory.connect(real_wallet).transfer(kittyPartyTreasury.address, ethers.utils.parseUnits("60"));



    const yielderFactory = await ethers.getContractFactory('KittyPartyYieldGeneratorAave');
    kittyPartyYieldGeneratorAave = await yielderFactory.deploy() as KittyPartyYieldGeneratorAave;
    console.log("Deploying kittyPartyYieldGeneratorAave Master...", kittyPartyYieldGeneratorAave.address);
    const aaveContractAddress = polygon.aave.aaveContractAddress;
    await kittyPartyYieldGeneratorAave.__KittyPartyYieldGeneratorAave_init(kittyPartyTreasury.address);
    await kittyPartyYieldGeneratorAave.setPartyInfo(dai_address, aaveContractAddress);
    await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);

    await kittyPartyYieldGeneratorAave.setAllowanceDeposit();

    const factoryFactory = await ethers.getContractFactory('KittyPartyFactory');
    const factory = await factoryFactory.deploy([ kittyPartyController.address, 
                                                 kittyPartyAccountant.address, 
                                                 kittens.address, 
                                                 kittyPartyTreasury.address, 
                                                 wallet.address
    ]) as KittyPartyFactory;
    const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
    const URI_SETTER_ROLE = ethers.utils.id("URI_SETTER_ROLE");
    const PAUSER_ROLE = ethers.utils.id("PAUSER_ROLE");
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    const GUARDIAN_ROLE = ethers.utils.id("GUARDIAN_ROLE");

    //Transfer admin role to factory contract for accountant so that clones can be granted minter role
    console.log("Transferring default admin role to factory ", factory.address, DEFAULT_ADMIN_ROLE);

    await kittyPartyAccountant.__KittyPartyAccountant_init(factory.address);
    await kittyPartyAccountant.grantRole(DEFAULT_ADMIN_ROLE, factory.address);
    await kittens.grantRole(DEFAULT_ADMIN_ROLE, factory.address);
    return factory;
  }

  let loadFixture: ReturnType<typeof createFixtureLoader>;


  before('create fixture loader', async () => {
    [wallet, other, kitten1, kitten2] = await (ethers as any).getSigners();
    loadFixture = createFixtureLoader([wallet, other, kitten1, kitten2]);    
  })

  beforeEach('deploy factory', async () => {
    factory = await loadFixture(fixture);
  })

  // Test case
  it('can fetch the master contract', async function () {
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await factory.kPFactory()).tomCatContract.toString()).to.equal(kittyPartyController.address);
  });
 
  // Test case
  it('can create a new contract', async function () {
    // Store a value
    let KittyInitiator = 
    {
       vrfEnabled: false,      
       kreatorFeesInBasisPoints: 10,
       daoFeesInBasisPoints: 10,
       winningStrategy: 1,
       timeToCollection: 20, 
       maxKittens: 2,
       durationInDays: 1,
       amountInDAIPerRound: 10,
       partyName: ethers.utils.formatBytes32String("test party"),
       daiAddress: dai_address,
       yieldContract:  kittyPartyYieldGeneratorAave.address
    };
  
    let KittyYieldArgs = {
      sellTokenAddress: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      lpTokenAddress: "0x27f8d03b3a2196956ed754badc28d73be8830a6e"
    };
    await daiFactory.approve(factory.address, KittyInitiator.amountInDAIPerRound.toString());
    await factory.createKitty(KittyInitiator, KittyYieldArgs);
    await network.provider.send("evm_increaseTime", [2*timeParameter]);
    console.log("wallet.address --",wallet.address);
    let deployedKitty = await factory.getMyKitties(wallet.address);

    console.log('deployedKitty[deployedKitty.length - 1]::',JSON.stringify(deployedKitty))



    const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
    kittyPartyController = await _KittyPartyController.attach(deployedKitty[deployedKitty.length - 1]) as KittyPartyController;
    // await controller.setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
    // expect(await kittyPartyController.owner()).to.equal(wallet.address);
  }).timeout(810000);

  // xit('can initialization a single lottery party of duration X and amount per round of 10$', async function () {
  //   // Test if the call to decide winner returns true
  //   // Additionally check that the winner address is one of the kittens
  //   let b = {
  //     partyName: ethers.utils.formatBytes32String("og"),
  //     amountInDAIPerRound: 10,
  //     daiAddress: daiFactory.address,
  //     durationInDays: 1,
  //     winningStrategy: 1,
  //     vrfEnabled: false,
  //     yieldContract: other.address,
  //     timeToCollection: 1,
  //     maxKittens: 400,
  //   };
  //   await daiFactory.approve(factory.address, b.amountInDAIPerRound.toString());

  //   await factory.createKitty(b);
  //   let deployedKitty = await factory.getMyKitties(wallet.address);
  //   const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  //   kittyPartyController = await _KittyPartyController.attach(deployedKitty[0]) as KittyPartyController;
  //   expect((await kittyPartyController.internalState())).to.equal(1);
  //   // await controller.applyWinnerStrategy();
  //   // let winners = (await controller.getWinners());
  //   // console.log(JSON.stringify(winners));
  //   // expect((await controller.getWinners())).to.have.lengthOf(1);
    
  // });

  // xit('cannot initiate a kitty if its is already initiated', async function () {
  //   let b = {
  //     partyName: ethers.utils.formatBytes32String("og"),
  //     amountInDAIPerRound: 10,
  //     daiAddress: daiFactory.address,
  //     durationInDays: 1,
  //     winningStrategy: 1,
  //     vrfEnabled: false,
  //     yieldContract: other.address,
  //     timeToCollection: 1,
  //     maxKittens: 400,
  //   };
  //   await daiFactory.approve(factory.address, b.amountInDAIPerRound.toString());

  //   await factory.createKitty(b);
  //   let deployedKitty = await factory.getMyKitties(wallet.address);
  //   const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  //   kittyPartyController = await _KittyPartyController.attach(deployedKitty[0]) as KittyPartyController;
  //   expect((await kittyPartyController.internalState())).to.equal(1);

  //   await expect(
  //     kittyPartyController.initialize(b, 
  //                                     kittyPartyAccountant.address,
  //                                     other.address, 
  //                                     wallet.address, 
  //                                     other.address, 
  //                                     other.address, 
  //                                     b.amountInDAIPerRound.toString()
  //                                   )
  //   ).to.be.revertedWith("Already Initialized");
    
  // });

  // it('can accept funds from kittens after initialization', async function () {
  //   let b = {
  //     partyName: ethers.utils.formatBytes32String("og"),
  //     amountInDAIPerRound: ethers.utils.parseUnits("10"),
  //     daiAddress: daiFactory.address,
  //     durationInDays: 1,
  //     winningStrategy: 1,
  //     vrfEnabled: false,
  //     yieldContract: other.address,
  //     timeToCollection: 14,
  //     maxKittens: 400,
  //   };
  //   await daiFactory.approve(factory.address, b.amountInDAIPerRound.toString());
  //   expect((await daiFactory.balanceOf(other.address))).to.equal(ethers.utils.parseUnits("0"));

  //   await factory.createKitty(b);
  //   // check that the kreators deposit has gone in
  //   expect((await daiFactory.balanceOf(other.address))).to.equal(ethers.utils.parseUnits("10"));

  //   let deployedKitty = await factory.getMyKitties(wallet.address);
  //   const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  //   kittyPartyController = await _KittyPartyController.attach(deployedKitty[0]) as KittyPartyController;
  //   expect((await kittyPartyController.internalState())).to.equal(1);
  //   await daiFactory.transfer(kitten1.address, ethers.utils.parseUnits("30"));
  //   await daiFactory.transfer(kitten2.address, ethers.utils.parseUnits("30"));



  //   await kittyPartyController.setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
  //   await daiFactory.connect(kitten1).approve(kittyPartyController.address,ethers.utils.parseUnits("100"));
  //   await daiFactory.connect(kitten2).approve(kittyPartyController.address,ethers.utils.parseUnits("100"));

  //   let stage = await kittyPartyController.stage();
  //   console.log('can accept funds from kittens after initialization -- stage::',stage)
  //   await kittyPartyController.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
  //   await kittyPartyController.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
  //   // console.log(ethers.utils.formatBytes32String("jointhebarty"))
  //   expect((await daiFactory.balanceOf(other.address))).to.equal(ethers.utils.parseUnits("30"));
  //   stage = await kittyPartyController.stage();
  //   console.log('can accept funds from kittens after initialization -- stage::', stage)
  // });

  // it('can proceed to staking stage from initial collection', async function () {
  //   let b = {
  //     partyName: ethers.utils.formatBytes32String("og"),
  //     amountInDAIPerRound: ethers.utils.parseUnits("10"),
  //     daiAddress: daiFactory.address,
  //     durationInDays: 30,
  //     winningStrategy: 1,
  //     vrfEnabled: false,
  //     yieldContract: other.address,
  //     timeToCollection: 1,
  //     maxKittens: 400,
  //   };
  //   await daiFactory.approve(factory.address, b.amountInDAIPerRound.toString());

  //   await factory.createKitty(b);
  //   let deployedKitty = await factory.getMyKitties(wallet.address);
  //   const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
  //   kittyPartyController = await _KittyPartyController.attach(deployedKitty[0]) as KittyPartyController;
  //   expect((await kittyPartyController.internalState())).to.equal(1);
  //   await daiFactory.transfer(kitten1.address, ethers.utils.parseUnits("30"));
  //   await daiFactory.transfer(kitten2.address, ethers.utils.parseUnits("30"));
  //   let stage = await kittyPartyController.getStage();
  //   // console.log('stage::',stage)
  //   await kittyPartyController.setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
  //   await daiFactory.connect(kitten1).approve(kittyPartyController.address, ethers.utils.parseUnits("10"));
  //   await daiFactory.connect(kitten2).approve(kittyPartyController.address, ethers.utils.parseUnits("10"));
  //   await kittyPartyController.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
  //   await kittyPartyController.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
  //   // console.log(ethers.utils.formatBytes32String("jointhebarty"))
  //   expect((await daiFactory.balanceOf(other.address))).to.equal(ethers.utils.parseUnits("30"));
  //   stage = await kittyPartyController.getStage();

 
  //   await kittyPartyController.applyInitialVerification();//CALL FROM ORACLE OR MANUAL
  //   expect((await kittyPartyController.numberOfRounds())).to.equal(0);
  //   stage = await kittyPartyController.getStage();
  //   await network.provider.send("evm_increaseTime", [24*timeParameter]);
  //   // stage = await kittyPartyController.stage();
  //   // should now goto staking = 2
  //   await kittyPartyController.changeState();//CALL FROM ORACLE OR MANUAL
  //   stage = await kittyPartyController.getStage();
  //   expect(stage).to.equal(2);

  // });

  it('can proceed to payout stage and pay winners from staking', async function () {
    let KittyInitiator = 
    {
       vrfEnabled: false,      
       kreatorFeesInBasisPoints: 10,
       daoFeesInBasisPoints: 10,
       winningStrategy: 1,
       timeToCollection: 1, 
       maxKittens: 2,
       durationInDays: 30,
       amountInDAIPerRound: ethers.utils.parseUnits("10"),
       partyName: ethers.utils.formatBytes32String("test party"),
       daiAddress: dai_address,
       yieldContract:  kittyPartyYieldGeneratorAave.address
    };
  
    let KittyYieldArgs = {
      sellTokenAddress: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      lpTokenAddress: "0x27f8d03b3a2196956ed754badc28d73be8830a6e"
    };
    await daiFactory.approve(factory.address, KittyInitiator.amountInDAIPerRound.toString());



    await factory.createKitty(KittyInitiator, KittyYieldArgs);
    let deployedKitty = await factory.getMyKitties(wallet.address);
    const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
    kittyPartyController = await _KittyPartyController.attach(deployedKitty[0]) as KittyPartyController;

    expect((await kittyPartyController.internalState())).to.equal(1);

    let stage = await kittyPartyController.getStage();
    console.log('stage::',stage)

     //Set invite HASH
    await kittyPartyController.setInviteHash(ethers.utils.formatBytes32String("jointhebarty"));
    await daiFactory.connect(kitten1).approve(kittyPartyController.address, ethers.utils.parseUnits("10"));
    await daiFactory.connect(kitten2).approve(kittyPartyController.address, ethers.utils.parseUnits("10"));
    await kittyPartyController.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
    await kittyPartyController.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointhebarty"));
    
    //Check DAI Balance of Yield Contract ( Here i use other.address instead of Yield Contract)
    expect((await daiFactory.balanceOf(kittyPartyYieldGeneratorAave.address))).to.equal(ethers.utils.parseUnits("30"));
    stage = await kittyPartyController.getStage();
    console.log('stage2::',stage)
    
 
    await kittyPartyController.applyInitialVerification( ethers.utils.formatBytes32String("0"));//CALL FROM ORACLE OR MANUAL
    console.log('Initial Verification called::')
    // expect((await kittyPartyController.numberOfRounds())).to.equal(0);
    stage = await kittyPartyController.getStage();
    console.log('stage3::',stage)

    await network.provider.send("evm_increaseTime", [24*timeParameter]);
    // stage = await kittyPartyController.stage();
    // should now goto staking = 2
    await kittyPartyController.changeState();//CALL FROM ORACLE OR MANUAL
    stage = await kittyPartyController.getStage();
    expect(stage).to.equal(2);
    console.log('stage4::',stage)

    await network.provider.send("evm_increaseTime", [30*24*timeParameter]);

    stage = await kittyPartyController.getStage();
    // GOTO Payout STATE
    await kittyPartyController.changeState();//CALL FROM ORACLE OR MANUAL
    stage = await kittyPartyController.getStage();
    expect(stage).to.equal(3);

    //PAYOUT also only lasts for timeToCollection Time so need to call applyWinnerStrategy in that 

    // time to applyWinnerStrategy
    await kittyPartyController.applyWinnerStrategy(ethers.utils.formatBytes32String("0"));//CALL FROM ORACLE OR MANUAL
    //TO KNOW WHO ARE THE WINNERS - Listen to KittyPartyAccountant for event TransferSingle("KittyParty Address", address(0), "WINNER ADDRESS", 0, "AMOUNT WON"); -- account is the winner
    kittyPartyAccountant.on("TransferSingle", (operator, from, to, id, value) => {
      console.log(to, " won " , ethers.utils.formatEther(value));
    })
    // To get the balance of the winner -  KittyPartyAccountant.balanceOf(kitten, 0) 

    


    let bal =  await daiFactory.balanceOf(kitten1.address) ;
    console.log("Balance of kitten before", ethers.utils.formatEther(bal));

    let tokenBal = await kittyPartyAccountant.connect(kitten1).balanceOf(kitten1.address, 0);
    console.log("tokenBal of kitten before", ethers.utils.formatEther(tokenBal));


    //This is setting approval for redeemTokens that is the receipt tokens different from ERC20 here do setApprovalForAll
    //1.APPROVE FOR WITHDRAWAL
    await kittyPartyAccountant.connect(kitten1).setApprovalForAll(kittyPartyTreasury.address, true);
    await kittyPartyAccountant.connect(kitten2).setApprovalForAll(kittyPartyTreasury.address, true);

    //2.WITHDRAWAL BUTTON $2 profit for eg
    await kittyPartyTreasury.connect(kitten1).redeemTokens(ethers.utils.parseUnits("12"));
    await kittyPartyTreasury.connect(kitten2).redeemTokens(ethers.utils.parseUnits("12"));
    //emit Transfer(sender, recipient, amount);

    bal =  await daiFactory.balanceOf(kitten1.address) ;
    console.log("Balance of kitten", ethers.utils.formatEther(bal));
    // expect((await daiFactory.balanceOf(kitten1.address))).to.equal(ethers.utils.parseUnits("20"));
    await network.provider.send("evm_increaseTime", [9*timeParameter]);
    await kittyPartyController.changeState();//CALL FROM ORACLE OR MANUAL

    stage = await kittyPartyController.getStage();
    expect(stage).to.equal(4);
    let factoryNFTBal = await kittyPartyAccountant.balanceOf(factory.address, 1);
    console.log("The amount of bronze NFT's with factory", factoryNFTBal.toString())

    let KPTReceiptBal = await kittyPartyAccountant.balanceOf(wallet.address, 0);
    console.log("Balance of Kreator before applyCompleteParty - ", ethers.utils.formatUnits(KPTReceiptBal, 0));

    //Now call the complete party and check if NFT badges are allocated to kittens
    await kittyPartyController.applyCompleteParty();//CALL FROM ORACLE OR MANUAL
    let NFTBal = await kittyPartyAccountant.connect(kitten1).balanceOf(kitten1.address, 1);
    KPTReceiptBal = await kittyPartyAccountant.balanceOf(wallet.address, 0);

    console.log("Balance of kitten", ethers.utils.formatUnits(NFTBal, 0));
    console.log("Balance of Kreator", ethers.utils.formatUnits(KPTReceiptBal, 0));


  }).timeout(12550000);

});
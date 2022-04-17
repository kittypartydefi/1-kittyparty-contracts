import { Wallet, utils  } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
import { expect } from "chai";
import { describe } from "mocha";
import { 
  ERC20,
  Kittens,
  KittyPartyAccountant,
  KittyPartyController,
  KittyPartyFactory,
  KittyPartyTreasury,
  KittyPartyToken,
  KittyPartyYieldGeneratorAave,
  KittyPartyWinnerDistributeEqual,
  KittyPartyStateTransitionKeeper,
  KittyPartyStateTransitionKeeper__factory
} from '../src/types/index';

let contractAddresses =  require("./ContractAddresses.ts");

const testNetwork = "mumbai";

const sellTokenAddress = contractAddresses[testNetwork].sellTokenAddress;
const aaveContractAddress = contractAddresses[testNetwork].aaveContractAddress;
const aaveDaiContractAddress = contractAddresses[testNetwork].aaveDaiContractAddress;
const aaveRewardContractAddress = contractAddresses[testNetwork].aaveRewardContractAddress;
const aaveRewardTokenContractAddress = contractAddresses[testNetwork].aaveRewardTokenContractAddress;
const daiHolder = contractAddresses[testNetwork].daiHolder;
console.log(
  "The addresses for test",
  sellTokenAddress,
  aaveContractAddress,
  aaveDaiContractAddress,
  aaveRewardContractAddress
)
describe("KittyParty contracts comprehensive test", function() {
    let deployer: Wallet, 
      kreator: Wallet, 
      KP_DAO_WALLET: Wallet, 
      kitten1: Wallet, 
      kitten2: Wallet;

    let dai: ERC20;
    let kittens: Kittens;
    let kittyPartyToken: KittyPartyToken;
    let kittyPartyAccountant: KittyPartyAccountant;
    let kittyPartyController: KittyPartyController;
    let kittyPartyFactory: KittyPartyFactory;
    let kittyPartyTreasury: KittyPartyTreasury;
    let kittyPartyYieldGeneratorAave: KittyPartyYieldGeneratorAave;
    let winnerStrategySingle: KittyPartyWinnerDistributeEqual;
    let kittyPartyStateTransitionKeeper: KittyPartyStateTransitionKeeper;

    const createFixtureLoader = waffle.createFixtureLoader;
    const fixture = async () => {
        const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");
        kittyPartyController = await _KittyPartyController.deploy() as KittyPartyController;
        await kittyPartyController.deployed();
        console.log("KittyPartyController Master deployed address:: ", kittyPartyController.address);

        const _KittyPartyAccountant = await ethers.getContractFactory("KittyPartyAccountant");
        kittyPartyAccountant = await _KittyPartyAccountant.deploy(KP_DAO_WALLET.address) as KittyPartyAccountant;
        await kittyPartyAccountant.deployed();
        console.log("KittyPartyAccountant deployed address:: ", kittyPartyAccountant.address);

        const _KittyPartyYieldGeneratorAave = await ethers.getContractFactory("KittyPartyYieldGeneratorAave");
        kittyPartyYieldGeneratorAave = await _KittyPartyYieldGeneratorAave.deploy() as KittyPartyYieldGeneratorAave;
        await kittyPartyYieldGeneratorAave.deployed();
        console.log("KittyPartyYieldGeneratorAave deployed address:: ", kittyPartyYieldGeneratorAave.address);

        const _WinnerStrategySingle = await ethers.getContractFactory('KittyPartyWinnerDistributeEqual');
        winnerStrategySingle = await _WinnerStrategySingle.deploy() as KittyPartyWinnerDistributeEqual;
        await winnerStrategySingle.deployed();
        console.log("WinnerStrategySingle deployed address:: ", winnerStrategySingle.address);   
        
        const _Kittens = await ethers.getContractFactory("Kittens");
        kittens = await _Kittens.deploy() as Kittens;
        await kittens.deployed();
        console.log("Kittens deployed address:: ", kittens.address);

        const _KittyPartyToken = await ethers.getContractFactory("KittyPartyToken");
        kittyPartyToken = await _KittyPartyToken.deploy() as KittyPartyToken;
        await kittyPartyToken.deployed();
        console.log("KPT deployed address:: ", kittyPartyToken.address);

        const _KittyPartyTreasury = await ethers.getContractFactory("KittyPartyTreasury");
        kittyPartyTreasury = await _KittyPartyTreasury.deploy() as KittyPartyTreasury;
        await kittyPartyTreasury.deployed();
        console.log("KittyPartyTreasury deployed address:: ", kittyPartyTreasury.address);

        const _DAI = await ethers.getContractFactory("ERC20");
        dai = _DAI.attach(sellTokenAddress) as ERC20;
        await kittyPartyTreasury.__KittyPartyTreasury_init(dai.address, kittyPartyToken.address, KP_DAO_WALLET.address, kittyPartyAccountant.address);
        
        const KittyPartyStateTransitionKeeper = await ethers.getContractFactory('KittyPartyStateTransitionKeeper');
        kittyPartyStateTransitionKeeper = await KittyPartyStateTransitionKeeper.deploy() as KittyPartyStateTransitionKeeper;
        await kittyPartyStateTransitionKeeper.deployed();

        const _KittyPartyFactory = await await ethers.getContractFactory("KittyPartyFactory");
        kittyPartyFactory = await _KittyPartyFactory.deploy() as KittyPartyFactory;
        await kittyPartyFactory.deployed();
        console.log("KittyPartyFactory deployed address:: ", kittyPartyFactory.address);

        await kittyPartyFactory.initialize(KP_DAO_WALLET.address);      
        await kittyPartyStateTransitionKeeper.grantRole("0x61c92169ef077349011ff0b1383c894d86c5f0b41d986366b58a6cf31e93beda", kittyPartyFactory.address);
    
        const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
        await kittens.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);
        await kittyPartyAccountant.grantRole(DEFAULT_ADMIN_ROLE, kittyPartyFactory.address);        

        await kittyPartyAccountant.__KittyPartyAccountant_init(kittyPartyFactory.address);        
        await kittyPartyAccountant.setTreasury(kittyPartyTreasury.address);

        await kittyPartyYieldGeneratorAave.__KittyPartyYieldGeneratorAave_init(kittyPartyTreasury.address);  
        await kittyPartyYieldGeneratorAave.setPlatformDepositContractAddress(aaveContractAddress);
        await kittyPartyYieldGeneratorAave.setPlatformRewardContractAddress(aaveRewardContractAddress, contractAddresses.mumbai.aaveRewardTokenContractAddress);
      
        let kpFactory = {
          "tomCatContract": kittyPartyController.address,
          "accountantContract": kittyPartyAccountant.address,
          "litterAddress": kittens.address,
          "daoTreasuryContract": KP_DAO_WALLET.address,
          "keeperContractAddress": kittyPartyStateTransitionKeeper.address
        };
        
        await kittyPartyFactory.connect(KP_DAO_WALLET).setFactoryInit(kpFactory);  
        await kittyPartyFactory.connect(KP_DAO_WALLET).setApprovedStrategy(kittyPartyYieldGeneratorAave.address);    
      };

    let loadFixture: ReturnType<typeof createFixtureLoader>;

    before('create fixture loader', async () => {
      [deployer, kreator, kitten1, kitten2, KP_DAO_WALLET] = await (ethers as any).getSigners();
      loadFixture = createFixtureLoader([deployer, kreator, kitten1, kitten2]);
    });

    beforeEach('deploy contracts', async () => {
      await loadFixture(fixture);     
      
      let KittyInitiator = 
      {
        winnerStrategy: winnerStrategySingle.address,      
        kreatorFeesInBasisPoints: 100,
        daoFeesInBasisPoints: 100,
        winningStrategy: 1,
        timeToCollection: 1, 
        maxKittens: 2,
        durationInDays: 1,
        amountInDAIPerRound: ethers.utils.parseUnits("20"),
        partyName: ethers.utils.formatBytes32String("just party"),
        daiAddress: sellTokenAddress,
        yieldContract: kittyPartyYieldGeneratorAave.address
      };

      let KittyYieldArgs = {
        sellTokenAddress: sellTokenAddress,
        lpTokenAddress: aaveDaiContractAddress
      };

      //impersonate big holder and send transfers 
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [daiHolder],
      });
      await network.provider.send("hardhat_setBalance", [
        daiHolder,
        "0x69D17119DC5A80000"
      ]);
      const daiSigner = await ethers.getSigner(daiHolder);

      await dai.connect(daiSigner).transfer(kreator.address, KittyInitiator.amountInDAIPerRound)
      await dai.connect(daiSigner).transfer(kitten1.address, KittyInitiator.amountInDAIPerRound)
      await dai.connect(daiSigner).transfer(kitten2.address, KittyInitiator.amountInDAIPerRound)

      const approveDAI = await dai.connect(kreator).approve(
        kittyPartyFactory.address, 
        (KittyInitiator.amountInDAIPerRound.div(10)).toString()
      );

      approveDAI.wait();
      // const balance = await dai.connect(kreator).balanceOf(kreator.address);
      // console.log("The amount of allowance - ", ethers.utils.formatEther(balance))

      const planetNFT = await kittyPartyAccountant.connect(KP_DAO_WALLET).mint(kreator.address, 1, 10, "0x");
      planetNFT.wait()
      await kittyPartyFactory.connect(kreator).createKitty(
        KittyInitiator, 
        KittyYieldArgs
      );

    })

    it('contracts deploy successfully', async function () {
      expect(kittens.address).to.not.be.undefined;
      expect(kittyPartyToken.address).to.not.be.undefined;
      expect(kittyPartyTreasury.address).to.not.be.undefined;
      expect(kittyPartyController.address).to.not.be.undefined;
      expect(kittyPartyAccountant.address).to.not.be.undefined;
      expect(kittyPartyYieldGeneratorAave.address).to.not.be.undefined;
      expect(kittyPartyFactory.address).to.not.be.undefined;
    });

    it('can initialize factory contract correctly', async function() {
      const _kpfactory =   await kittyPartyFactory.kpFactory();
      expect(_kpfactory.tomCatContract).to.be.equal(kittyPartyController.address);
      expect(_kpfactory.accountantContract).to.be.equal(kittyPartyAccountant.address);
      expect(_kpfactory.litterAddress).to.be.equal(kittens.address);
      expect(_kpfactory.daoTreasuryContract).to.be.equal(KP_DAO_WALLET.address);
      expect(_kpfactory.keeperContractAddress).to.be.equal(kittyPartyStateTransitionKeeper.address);
    });

    it('kreator can successfully create a new party', async function () {
      let deployedKitty = await kittyPartyFactory.getMyKitties(kreator.address);
      expect(JSON.stringify(deployedKitty[deployedKitty.length - 1])).to.not.be.undefined;          
    });

    it('can deposit and add kittens to party', async function() {
      let deployedKitty = await kittyPartyFactory.getMyKitties(kreator.address);
      const kittyPartyDeployed = deployedKitty[deployedKitty.length - 1];
      const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");

      let kittyParty = _KittyPartyController.attach(kittyPartyDeployed);
      await dai.connect(kitten1).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
      await dai.connect(kitten2).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
        
      await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyDeployed);
      await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyDeployed);

      await kittyParty.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));

      const kittyList = await kittens.getList(kittyPartyDeployed);
      expect(kittyList[0].kitten).to.be.equal(kitten1.address);
      expect(kittyList[1].kitten).to.be.equal(kitten2.address);

      const lockedAmount = await kittyPartyYieldGeneratorAave.lockedAmount(kittyPartyDeployed);
      expect(Math.round(parseFloat(ethers.utils.formatEther(lockedAmount.toString())))).to.be.equal(42);
    }).timeout(100000);

    it('can apply initial verification', async function() {
      let deployedKitty = await kittyPartyFactory.getMyKitties(kreator.address);
      const kittyPartyDeployed = deployedKitty[deployedKitty.length - 1];
      const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");

      let kittyParty = _KittyPartyController.attach(kittyPartyDeployed);
      await dai.connect(kitten1).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
      await dai.connect(kitten2).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
        
      await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyDeployed);
      await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyDeployed);

      await kittyParty.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));

      let stage = await kittyParty.getStage();
      expect(stage).to.be.equal(0);
      
      await network.provider.send("evm_increaseTime", [1*24*60*61]);
      await kittyParty.applyInitialVerification();

      stage = await kittyParty.getStage();
      let controllerVars = await kittyParty.kittyPartyControllerVars();
      expect(stage).to.be.equal(2);
      expect(controllerVars.internalState).to.be.equal(2);
    }).timeout(80000);

    it('can stop staking, apply winner stratgy and pay organizer fees', async function() {
      let deployedKitty = await kittyPartyFactory.getMyKitties(kreator.address);
      const kittyPartyDeployed = deployedKitty[deployedKitty.length - 1];
      const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");

      let kittyParty = _KittyPartyController.attach(kittyPartyDeployed);
      await dai.connect(kitten1).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
      await dai.connect(kitten2).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
        
      await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyDeployed);
      await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyDeployed);

      await kittyParty.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));
      
      await network.provider.send("evm_increaseTime", [1*24*60*61]);
      await kittyParty.applyInitialVerification();

      await network.provider.send("evm_increaseTime", [1*24*60*61]);
      await kittyParty.stopStaking();

      let stage = await kittyParty.getStage();
      expect(stage).to.be.equal(3);

      await kittyParty.payOrganizerFees();

      const kreatorBalance = await kittyPartyAccountant.balanceOf(kreator.address, 0);
      expect(parseFloat(ethers.utils.formatEther(kreatorBalance.toString()))).to.be.above(0);

      await kittyParty.applyWinnerStrategy();

      const kitten1Balance = await kittyPartyAccountant.balanceOf(kitten1.address, 0);
      const kitten2Balance = await kittyPartyAccountant.balanceOf(kitten2.address, 0);
      expect(parseFloat(ethers.utils.formatEther(kitten1Balance.toString()))).to.be.above(20);
      expect(parseFloat(ethers.utils.formatEther(kitten2Balance.toString()))).to.be.above(20);
    }).timeout(80000);

    it('can complete party and redeem tokens', async function() {
      let deployedKitty = await kittyPartyFactory.getMyKitties(kreator.address);
      const kittyPartyDeployed = deployedKitty[deployedKitty.length - 1];
      const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");

      let kittyParty = _KittyPartyController.attach(kittyPartyDeployed);
      await dai.connect(kitten1).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
      await dai.connect(kitten2).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
        
      await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyDeployed);
      await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyDeployed);

      await kittyParty.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));
      
      await network.provider.send("evm_increaseTime", [1*24*60*61]);
      await kittyParty.applyInitialVerification();

      await network.provider.send("evm_increaseTime", [1*24*60*61]);
      await kittyParty.stopStaking();
      await kittyParty.payOrganizerFees();
      await kittyParty.applyWinnerStrategy();
      
      await network.provider.send("evm_increaseTime", [8*60*61]);
      await kittyParty.applyCompleteParty();

      let stage = await kittyParty.getStage();
      expect(stage).to.be.equal(4);

      let controllerVars = await kittyParty.kittyPartyControllerVars();
      expect(controllerVars.internalState).to.be.equal(3);

      const kreatorBalance = await kittyPartyAccountant.balanceOf(kreator.address, 0);
      const kitten1ReceiptBalance = await kittyPartyAccountant.balanceOf(kitten1.address, 0);
      const kitten2ReceiptBalance = await kittyPartyAccountant.balanceOf(kitten2.address, 0);

      const kreatorInitial = await dai.balanceOf(kreator.address);
      const kitten1Initial = await dai.balanceOf(kitten1.address);
      const kitten2Initial = await dai.balanceOf(kitten2.address);

      await kittyPartyAccountant.connect(kreator).setApprovalForAll(kittyPartyTreasury.address, true);
      await kittyPartyAccountant.connect(kitten1).setApprovalForAll(kittyPartyTreasury.address, true);
      await kittyPartyAccountant.connect(kitten2).setApprovalForAll(kittyPartyTreasury.address, true);

      await kittyPartyTreasury.connect(kreator).redeemTokens(kreatorBalance);
      await kittyPartyTreasury.connect(kitten1).redeemTokens(kitten1ReceiptBalance);
      await kittyPartyTreasury.connect(kitten2).redeemTokens(kitten2ReceiptBalance);

      const kreatorFinal = await dai.balanceOf(kreator.address);
      const kitten1Final = await dai.balanceOf(kitten1.address);
      const kitten2Final = await dai.balanceOf(kitten2.address);

      expect(
        parseFloat(ethers.utils.formatEther(kreatorFinal.toString())) - 
        parseFloat(ethers.utils.formatEther(kreatorInitial.toString()))
      ).to.be.above(Math.floor(parseFloat(ethers.utils.formatEther(kreatorBalance.toString()))));

      expect(
        parseFloat(ethers.utils.formatEther(kitten1Final.toString())) - 
        parseFloat(ethers.utils.formatEther(kitten1Initial.toString()))
      ).to.be.above(Math.floor(parseFloat(ethers.utils.formatEther(kitten1ReceiptBalance.toString()))));

      expect(
        parseFloat(ethers.utils.formatEther(kitten2Final.toString())) - 
        parseFloat(ethers.utils.formatEther(kitten2Initial.toString()))
      ).to.be.above(Math.floor(parseFloat(ethers.utils.formatEther(kitten2ReceiptBalance.toString()))));
    }).timeout(80000);

    it('can issue refund and redeem tokens', async function() {
      let deployedKitty = await kittyPartyFactory.getMyKitties(kreator.address);
      const kittyPartyDeployed = deployedKitty[deployedKitty.length - 1];
      const _KittyPartyController = await ethers.getContractFactory("KittyPartyController");

      let kittyParty = _KittyPartyController.attach(kittyPartyDeployed);
      await dai.connect(kitten1).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
      await dai.connect(kitten2).approve(kittyPartyDeployed,ethers.utils.parseUnits("20"));
        
      await kittyPartyYieldGeneratorAave.setAllowanceDeposit(kittyPartyDeployed);
      await kittyPartyYieldGeneratorAave.setAllowanceWithdraw(kittyPartyDeployed);

      await kittyParty.connect(kreator).setInviteHash(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten1).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));
      await kittyParty.connect(kitten2).depositAndAddKittenToParty(ethers.utils.formatBytes32String("jointheparty"));

      await network.provider.send("evm_increaseTime", [1*24*60*61]);
      await kittyParty.applyInitialVerification();

      await kittyParty.connect(kreator).issueRefund();
      const kitten1ReceiptBalance = await kittyPartyAccountant.balanceOf(kitten1.address, 0);
      const kitten2ReceiptBalance = await kittyPartyAccountant.balanceOf(kitten2.address, 0);
      const kitten1Initial = await dai.balanceOf(kitten1.address);
      const kitten2Initial = await dai.balanceOf(kitten2.address);

      await kittyPartyAccountant.connect(kitten1).setApprovalForAll(kittyPartyTreasury.address, true);
      await kittyPartyAccountant.connect(kitten2).setApprovalForAll(kittyPartyTreasury.address, true);

      await kittyPartyTreasury.connect(kitten1).redeemTokens(kitten1ReceiptBalance);
      await kittyPartyTreasury.connect(kitten2).redeemTokens(kitten2ReceiptBalance);

      const kitten1Final = await dai.balanceOf(kitten1.address);
      const kitten2Final = await dai.balanceOf(kitten2.address);

      expect(
        parseFloat(ethers.utils.formatEther(kitten1Final.toString())) - 
        parseFloat(ethers.utils.formatEther(kitten1Initial.toString()))
      ).to.be.equal(parseFloat(ethers.utils.formatEther(kitten1ReceiptBalance.toString())));

      expect(
        parseFloat(ethers.utils.formatEther(kitten2Final.toString())) - 
        parseFloat(ethers.utils.formatEther(kitten2Initial.toString()))
      ).to.be.equal(parseFloat(ethers.utils.formatEther(kitten2ReceiptBalance.toString())));
    });
});

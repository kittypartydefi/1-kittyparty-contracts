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
const KP_DAO_ADDRESS = "0x9CbeF40aEe5Eb4b541DA73409F8425A3aae5fd1e";

const sellTokenAddress = contractAddresses[testNetwork].sellTokenAddress;
const aaveContractAddress = contractAddresses[testNetwork].aaveContractAddress;
const aaveDaiContractAddress = contractAddresses[testNetwork].aaveDaiContractAddress;
const aaveRewardContractAddress = contractAddresses[testNetwork].aaveRewardContractAddress;
const aaveRewardTokenContractAddress = contractAddresses[testNetwork].aaveRewardTokenContractAddress;


describe("KittyParty contracts comprehensive test", function() {
    let deployer: Wallet, 
      kreator: Wallet, 
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
        kittyPartyAccountant = await _KittyPartyAccountant.deploy(KP_DAO_ADDRESS) as KittyPartyAccountant;
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
        await kittyPartyTreasury.__KittyPartyTreasury_init(dai.address, kittyPartyToken.address, KP_DAO_ADDRESS, kittyPartyAccountant.address);
        
        const KittyPartyStateTransitionKeeper = await ethers.getContractFactory('KittyPartyStateTransitionKeeper');
        kittyPartyStateTransitionKeeper = await KittyPartyStateTransitionKeeper.deploy() as KittyPartyStateTransitionKeeper;
        await kittyPartyStateTransitionKeeper.deployed();

        const _KittyPartyFactory = await await ethers.getContractFactory("KittyPartyFactory");
        kittyPartyFactory = await _KittyPartyFactory.deploy() as KittyPartyFactory;
        await kittyPartyFactory.deployed();
        console.log("KittyPartyFactory deployed address:: ", kittyPartyFactory.address);

        await kittyPartyFactory.initialize(KP_DAO_ADDRESS);      
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
          "daoTreasuryContract": KP_DAO_ADDRESS,
          "keeperContractAddress": kittyPartyStateTransitionKeeper.address
        };
        
        await kittyPartyFactory.setFactoryInit(kpFactory);  
        await kittyPartyFactory.setApprovedStrategy(kittyPartyYieldGeneratorAave.address);    
      };

    let loadFixture: ReturnType<typeof createFixtureLoader>;

    before('create fixture loader', async () => {
      [deployer, kreator, kitten1, kitten2] = await (ethers as any).getSigners();
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

      await dai.connect(kreator).approve(
        kittyPartyFactory.address, 
        (KittyInitiator.amountInDAIPerRound.div(10)).toString()
      );

      await kittyPartyAccountant.mint(kreator.address, 1, 10, "0x");
      await kittyPartyFactory.connect(kreator).createKitty(
        KittyInitiator, 
        KittyYieldArgs
      );

    });

    it('contracts deploy successfully', async function () {
        expect(kittens.address).to.not.be.undefined;
        expect(kittyPartyToken.address).to.not.be.undefined;
        expect(kittyPartyTreasury.address).to.not.be.undefined;
        expect(kittyPartyController.address).to.not.be.undefined;
        expect(kittyPartyAccountant.address).to.not.be.undefined;
        expect(kittyPartyYieldGeneratorAave.address).to.not.be.undefined;
        expect(kittyPartyFactory.address).to.not.be.undefined;
    });

    xit('keeper can make state transitions', async function () {
        
    });

    xit('keeper can correctly handle simultaneous state transition calls to complete party', async function () {
        
    });
});
  
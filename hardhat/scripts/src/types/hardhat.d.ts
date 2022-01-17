/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "OwnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradeable__factory>;
    getContractFactory(
      name: "IERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Upgradeable__factory>;
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155__factory>;
    getContractFactory(
      name: "ERC1155Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Burnable__factory>;
    getContractFactory(
      name: "IERC1155MetadataURI",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155MetadataURI__factory>;
    getContractFactory(
      name: "IERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155__factory>;
    getContractFactory(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Receiver__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Permit__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "ERC20Capped",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Capped__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "KittyPartyWinnerSelectionOptions",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyWinnerSelectionOptions__factory>;
    getContractFactory(
      name: "KeeperCompatibleInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KeeperCompatibleInterface__factory>;
    getContractFactory(
      name: "IKittyPartyAccountant",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKittyPartyAccountant__factory>;
    getContractFactory(
      name: "IKittyPartyKeeper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKittyPartyKeeper__factory>;
    getContractFactory(
      name: "IKittyPartyWinnerStrategy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKittyPartyWinnerStrategy__factory>;
    getContractFactory(
      name: "IKittyPartyYieldGenerator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IKittyPartyYieldGenerator__factory>;
    getContractFactory(
      name: "Kittens",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Kittens__factory>;
    getContractFactory(
      name: "KittyPartyAccountant",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyAccountant__factory>;
    getContractFactory(
      name: "KittyPartyController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyController__factory>;
    getContractFactory(
      name: "KittyPartyFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyFactory__factory>;
    getContractFactory(
      name: "KittyPartyStateTransition",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyStateTransition__factory>;
    getContractFactory(
      name: "KittyPartyStateTransitionKeeper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyStateTransitionKeeper__factory>;
    getContractFactory(
      name: "KittyPartyToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyToken__factory>;
    getContractFactory(
      name: "KittyPartyTreasury",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyTreasury__factory>;
    getContractFactory(
      name: "KittyPartyWinnerDistributeEqual",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyWinnerDistributeEqual__factory>;
    getContractFactory(
      name: "KittyPartyYieldGeneratorAave",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyYieldGeneratorAave__factory>;
    getContractFactory(
      name: "KittyPartyYieldGeneratorZapper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittyPartyYieldGeneratorZapper__factory>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
  }
}
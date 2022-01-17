/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface KittyPartyFactoryInterface extends ethers.utils.Interface {
  functions: {
    "createKitty(tuple,tuple)": FunctionFragment;
    "daoAddress()": FunctionFragment;
    "daoFeesInBasisPoints()": FunctionFragment;
    "getMyKitties(address)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "kpFactory()": FunctionFragment;
    "kreatorFeesInBasisPoints()": FunctionFragment;
    "myKitties(address,uint256)": FunctionFragment;
    "myStrategies(address)": FunctionFragment;
    "setApprovedStrategy(address)": FunctionFragment;
    "setDAOFees(uint8)": FunctionFragment;
    "setFactoryInit(tuple)": FunctionFragment;
    "setKreatorFees(uint8)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createKitty",
    values: [
      {
        kreatorFeesInBasisPoints: BigNumberish;
        daoFeesInBasisPoints: BigNumberish;
        winningStrategy: BigNumberish;
        timeToCollection: BigNumberish;
        maxKittens: BigNumberish;
        durationInDays: BigNumberish;
        amountInDAIPerRound: BigNumberish;
        partyName: BytesLike;
        daiAddress: string;
        yieldContract: string;
        winnerStrategy: string;
      },
      { sellTokenAddress: string; lpTokenAddress: string }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "daoAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "daoFeesInBasisPoints",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getMyKitties",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(functionFragment: "kpFactory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "kreatorFeesInBasisPoints",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "myKitties",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "myStrategies",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovedStrategy",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setDAOFees",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setFactoryInit",
    values: [
      {
        tomCatContract: string;
        accountantContract: string;
        litterAddress: string;
        daoTreasuryContract: string;
        keeperContractAddress: string;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setKreatorFees",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "createKitty",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "daoAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "daoFeesInBasisPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMyKitties",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "kpFactory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "kreatorFeesInBasisPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "myKitties", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "myStrategies",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovedStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setDAOFees", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setFactoryInit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setKreatorFees",
    data: BytesLike
  ): Result;

  events: {
    "FactoryInitialized()": EventFragment;
    "KittyLive(address,address,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "FactoryInitialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "KittyLive"): EventFragment;
}

export class KittyPartyFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: KittyPartyFactoryInterface;

  functions: {
    createKitty(
      _kittyInitiator: {
        kreatorFeesInBasisPoints: BigNumberish;
        daoFeesInBasisPoints: BigNumberish;
        winningStrategy: BigNumberish;
        timeToCollection: BigNumberish;
        maxKittens: BigNumberish;
        durationInDays: BigNumberish;
        amountInDAIPerRound: BigNumberish;
        partyName: BytesLike;
        daiAddress: string;
        yieldContract: string;
        winnerStrategy: string;
      },
      _kittyYieldArgs: { sellTokenAddress: string; lpTokenAddress: string },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    daoAddress(overrides?: CallOverrides): Promise<[string]>;

    daoFeesInBasisPoints(overrides?: CallOverrides): Promise<[number]>;

    getMyKitties(
      candidateAddress: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    initialize(
      _daoAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    kpFactory(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, string] & {
        tomCatContract: string;
        accountantContract: string;
        litterAddress: string;
        daoTreasuryContract: string;
        keeperContractAddress: string;
      }
    >;

    kreatorFeesInBasisPoints(overrides?: CallOverrides): Promise<[number]>;

    myKitties(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    myStrategies(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    setApprovedStrategy(
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDAOFees(
      _daoFeesInBasisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setFactoryInit(
      _kpFactory: {
        tomCatContract: string;
        accountantContract: string;
        litterAddress: string;
        daoTreasuryContract: string;
        keeperContractAddress: string;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setKreatorFees(
      _kreatorFeesInBasisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  createKitty(
    _kittyInitiator: {
      kreatorFeesInBasisPoints: BigNumberish;
      daoFeesInBasisPoints: BigNumberish;
      winningStrategy: BigNumberish;
      timeToCollection: BigNumberish;
      maxKittens: BigNumberish;
      durationInDays: BigNumberish;
      amountInDAIPerRound: BigNumberish;
      partyName: BytesLike;
      daiAddress: string;
      yieldContract: string;
      winnerStrategy: string;
    },
    _kittyYieldArgs: { sellTokenAddress: string; lpTokenAddress: string },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  daoAddress(overrides?: CallOverrides): Promise<string>;

  daoFeesInBasisPoints(overrides?: CallOverrides): Promise<number>;

  getMyKitties(
    candidateAddress: string,
    overrides?: CallOverrides
  ): Promise<string[]>;

  initialize(
    _daoAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  kpFactory(
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, string, string] & {
      tomCatContract: string;
      accountantContract: string;
      litterAddress: string;
      daoTreasuryContract: string;
      keeperContractAddress: string;
    }
  >;

  kreatorFeesInBasisPoints(overrides?: CallOverrides): Promise<number>;

  myKitties(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  myStrategies(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  setApprovedStrategy(
    _strategy: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDAOFees(
    _daoFeesInBasisPoints: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setFactoryInit(
    _kpFactory: {
      tomCatContract: string;
      accountantContract: string;
      litterAddress: string;
      daoTreasuryContract: string;
      keeperContractAddress: string;
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setKreatorFees(
    _kreatorFeesInBasisPoints: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createKitty(
      _kittyInitiator: {
        kreatorFeesInBasisPoints: BigNumberish;
        daoFeesInBasisPoints: BigNumberish;
        winningStrategy: BigNumberish;
        timeToCollection: BigNumberish;
        maxKittens: BigNumberish;
        durationInDays: BigNumberish;
        amountInDAIPerRound: BigNumberish;
        partyName: BytesLike;
        daiAddress: string;
        yieldContract: string;
        winnerStrategy: string;
      },
      _kittyYieldArgs: { sellTokenAddress: string; lpTokenAddress: string },
      overrides?: CallOverrides
    ): Promise<string>;

    daoAddress(overrides?: CallOverrides): Promise<string>;

    daoFeesInBasisPoints(overrides?: CallOverrides): Promise<number>;

    getMyKitties(
      candidateAddress: string,
      overrides?: CallOverrides
    ): Promise<string[]>;

    initialize(_daoAddress: string, overrides?: CallOverrides): Promise<void>;

    kpFactory(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, string] & {
        tomCatContract: string;
        accountantContract: string;
        litterAddress: string;
        daoTreasuryContract: string;
        keeperContractAddress: string;
      }
    >;

    kreatorFeesInBasisPoints(overrides?: CallOverrides): Promise<number>;

    myKitties(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    myStrategies(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    setApprovedStrategy(
      _strategy: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setDAOFees(
      _daoFeesInBasisPoints: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setFactoryInit(
      _kpFactory: {
        tomCatContract: string;
        accountantContract: string;
        litterAddress: string;
        daoTreasuryContract: string;
        keeperContractAddress: string;
      },
      overrides?: CallOverrides
    ): Promise<void>;

    setKreatorFees(
      _kreatorFeesInBasisPoints: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    FactoryInitialized(): TypedEventFilter<[], {}>;

    KittyLive(
      kreator?: string | null,
      kitty?: null,
      kittyPartyName?: null
    ): TypedEventFilter<
      [string, string, string],
      { kreator: string; kitty: string; kittyPartyName: string }
    >;
  };

  estimateGas: {
    createKitty(
      _kittyInitiator: {
        kreatorFeesInBasisPoints: BigNumberish;
        daoFeesInBasisPoints: BigNumberish;
        winningStrategy: BigNumberish;
        timeToCollection: BigNumberish;
        maxKittens: BigNumberish;
        durationInDays: BigNumberish;
        amountInDAIPerRound: BigNumberish;
        partyName: BytesLike;
        daiAddress: string;
        yieldContract: string;
        winnerStrategy: string;
      },
      _kittyYieldArgs: { sellTokenAddress: string; lpTokenAddress: string },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    daoAddress(overrides?: CallOverrides): Promise<BigNumber>;

    daoFeesInBasisPoints(overrides?: CallOverrides): Promise<BigNumber>;

    getMyKitties(
      candidateAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _daoAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    kpFactory(overrides?: CallOverrides): Promise<BigNumber>;

    kreatorFeesInBasisPoints(overrides?: CallOverrides): Promise<BigNumber>;

    myKitties(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    myStrategies(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setApprovedStrategy(
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDAOFees(
      _daoFeesInBasisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setFactoryInit(
      _kpFactory: {
        tomCatContract: string;
        accountantContract: string;
        litterAddress: string;
        daoTreasuryContract: string;
        keeperContractAddress: string;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setKreatorFees(
      _kreatorFeesInBasisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createKitty(
      _kittyInitiator: {
        kreatorFeesInBasisPoints: BigNumberish;
        daoFeesInBasisPoints: BigNumberish;
        winningStrategy: BigNumberish;
        timeToCollection: BigNumberish;
        maxKittens: BigNumberish;
        durationInDays: BigNumberish;
        amountInDAIPerRound: BigNumberish;
        partyName: BytesLike;
        daiAddress: string;
        yieldContract: string;
        winnerStrategy: string;
      },
      _kittyYieldArgs: { sellTokenAddress: string; lpTokenAddress: string },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    daoAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    daoFeesInBasisPoints(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMyKitties(
      candidateAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _daoAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    kpFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    kreatorFeesInBasisPoints(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    myKitties(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    myStrategies(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setApprovedStrategy(
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDAOFees(
      _daoFeesInBasisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setFactoryInit(
      _kpFactory: {
        tomCatContract: string;
        accountantContract: string;
        litterAddress: string;
        daoTreasuryContract: string;
        keeperContractAddress: string;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setKreatorFees(
      _kreatorFeesInBasisPoints: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
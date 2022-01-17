/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  KittyPartyStateTransition,
  KittyPartyStateTransitionInterface,
} from "../KittyPartyStateTransition";

const _abi = [
  {
    anonymous: false,
    inputs: [],
    name: "Completed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "party",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prevStage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nextStage",
        type: "uint256",
      },
    ],
    name: "StageTransition",
    type: "event",
  },
  {
    inputs: [],
    name: "currentRound",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "durationInDays",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isTransitionRequired",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastStageTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numberOfRounds",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stage",
    outputs: [
      {
        internalType: "enum KittyPartyStateTransition.KittyPartyStages",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "timeSinceChange",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "timeToCollection",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000805460ff1916905534801561001a57600080fd5b506104ad8061002a6000396000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c806354b6ba9511610076578063c040e6b81161005b578063c040e6b81461013c578063f29e493f14610156578063fcaa76641461015e57600080fd5b806354b6ba951461011b5780638a19c8bc1461012957600080fd5b8063236ad73c146100a8578063348056e7146100c4578063376387c1146100ea5780633bde045f146100f2575b600080fd5b6100b160015481565b6040519081526020015b60405180910390f35b6002546100d8906301000000900460ff1681565b60405160ff90911681526020016100bb565b6100d8610166565b60025461010890640100000000900461ffff1681565b60405161ffff90911681526020016100bb565b6002546101089061ffff1681565b6002546100d89062010000900460ff1681565b6000546101499060ff1681565b6040516100bb91906103ba565b6100b1610380565b6100b1610390565b60008060005460ff166005811115610180576101806103a4565b1480156101b857506002546101a2906301000000900460ff16620151806103f8565b62ffffff166001546101b49190610423565b4210155b806101f35750600160005460ff1660058111156101d7576101d76103a4565b1480156101f357506001546101ef9062015180610423565b4210155b806102445750600260005460ff166005811115610212576102126103a4565b148015610244575060025461022e9061ffff16620151806103f8565b62ffffff166001546102409190610423565b4210155b806102a05750600360005460ff166005811115610263576102636103a4565b14801561027e575060015461027a90617080610423565b4210155b80156102a0575060025462010000810460ff1664010000000090910461ffff16115b806102fd5750600360005460ff1660058111156102bf576102bf6103a4565b1480156102da57506001546102d690617080610423565b4210155b80156102fd575060025462010000810460ff1664010000000090910461ffff1611155b1561037a5760005460029060ff16600581111561031c5761031c6103a4565b60ff1611156103515760025462010000810460ff1664010000000090910461ffff161161034a576001610354565b6000610354565b60005b60005460ff16600581111561036b5761036b6103a4565b610375919061043b565b905090565b50605890565b6000600154426103759190610460565b6000805460ff166005811115610375576103755b634e487b7160e01b600052602160045260246000fd5b60208101600683106103dc57634e487b7160e01b600052602160045260246000fd5b91905290565b634e487b7160e01b600052601160045260246000fd5b600062ffffff8083168185168183048111821515161561041a5761041a6103e2565b02949350505050565b60008219821115610436576104366103e2565b500190565b600060ff821660ff84168060ff03821115610458576104586103e2565b019392505050565b600082821015610472576104726103e2565b50039056fea2646970667358221220893551249c7fde13844d59c71672cc4a0b1dc388ad287acdacdea412510219ab64736f6c634300080b0033";

export class KittyPartyStateTransition__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<KittyPartyStateTransition> {
    return super.deploy(overrides || {}) as Promise<KittyPartyStateTransition>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): KittyPartyStateTransition {
    return super.attach(address) as KittyPartyStateTransition;
  }
  connect(signer: Signer): KittyPartyStateTransition__factory {
    return super.connect(signer) as KittyPartyStateTransition__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KittyPartyStateTransitionInterface {
    return new utils.Interface(_abi) as KittyPartyStateTransitionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KittyPartyStateTransition {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as KittyPartyStateTransition;
  }
}
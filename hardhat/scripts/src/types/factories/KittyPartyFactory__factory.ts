/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  KittyPartyFactory,
  KittyPartyFactoryInterface,
} from "../KittyPartyFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [],
    name: "FactoryInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "kreator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "kitty",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "kittyPartyName",
        type: "bytes32",
      },
    ],
    name: "KittyLive",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "kreatorFeesInBasisPoints",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "daoFeesInBasisPoints",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "winningStrategy",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "timeToCollection",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "maxKittens",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "durationInDays",
            type: "uint16",
          },
          {
            internalType: "uint256",
            name: "amountInDAIPerRound",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "partyName",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "daiAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "yieldContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "winnerStrategy",
            type: "address",
          },
        ],
        internalType: "struct IKittenPartyInit.KittyInitiator",
        name: "_kittyInitiator",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "sellTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "lpTokenAddress",
            type: "address",
          },
        ],
        internalType: "struct IKittenPartyInit.KittyYieldArgs",
        name: "_kittyYieldArgs",
        type: "tuple",
      },
    ],
    name: "createKitty",
    outputs: [
      {
        internalType: "address",
        name: "kittyAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "daoAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "daoFeesInBasisPoints",
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
    inputs: [
      {
        internalType: "address",
        name: "candidateAddress",
        type: "address",
      },
    ],
    name: "getMyKitties",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "kpFactory",
    outputs: [
      {
        internalType: "address",
        name: "tomCatContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "accountantContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "litterAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "daoTreasuryContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "keeperContractAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kreatorFeesInBasisPoints",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "myKitties",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "myStrategies",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_strategy",
        type: "address",
      },
    ],
    name: "setApprovedStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_daoFeesInBasisPoints",
        type: "uint8",
      },
    ],
    name: "setDAOFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tomCatContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "accountantContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "litterAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "daoTreasuryContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "keeperContractAddress",
            type: "address",
          },
        ],
        internalType: "struct IKittenPartyInit.KittyPartyFactoryArgs",
        name: "_kpFactory",
        type: "tuple",
      },
    ],
    name: "setFactoryInit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_kreatorFeesInBasisPoints",
        type: "uint8",
      },
    ],
    name: "setKreatorFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611473806100206000396000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c8063890e93851161008c578063a42ae7aa11610066578063a42ae7aa1461021f578063a4c378fd14610232578063c4d66de814610245578063cba93f6d1461025857600080fd5b8063890e9385146101d95780638efb8293146101ec5780639c6854c6146101ff57600080fd5b806337349198116100bd5780633734919814610142578063490d94ce1461016157806378c9fc4f1461017357600080fd5b80632131c68c146100e4578063265a3d5d1461011a578063300b70061461012f575b600080fd5b6008546100fd906201000090046001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61012d61012836600461101b565b61028b565b005b61012d61013d36600461104e565b6102cc565b60085461014f9060ff1681565b60405160ff9091168152602001610111565b60085461014f90610100900460ff1681565b60015460025460035460045460055461019f946001600160a01b03908116948116938116928116911685565b604080516001600160a01b03968716815294861660208601529285169284019290925283166060830152909116608082015260a001610111565b6100fd6101e7366004611069565b6102ff565b6100fd6101fa366004611093565b610337565b61021261020d36600461101b565b610cc1565b60405161011191906110da565b61012d61022d366004611127565b610d37565b61012d61024036600461104e565b610dfd565b61012d61025336600461101b565b610e36565b61027b61026636600461101b565b60076020526000908152604090205460ff1681565b6040519015158152602001610111565b6008546201000090046001600160a01b031633146102a857600080fd5b6001600160a01b03166000908152600760205260409020805460ff19166001179055565b6008546201000090046001600160a01b031633146102e957600080fd5b6008805460ff191660ff92909216919091179055565b6006602052816000526040600020818154811061031b57600080fd5b6000918252602090912001546001600160a01b03169150829050565b6001546000908190610351906001600160a01b0316610f49565b905060006103676101208601610100870161101b565b6040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523360048201523060248201529091506000906001600160a01b0383169063dd62ed3e90604401602060405180830381865afa1580156103d0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103f491906111c3565b9050600061040d670de0b6b3a7640000620f42406111dc565b8760c0013510156104455761042c670de0b6b3a76400006103e86111dc565b8760c00135101561043e576001610448565b6002610448565b60035b60ff169050600760006104636101408a016101208b0161101b565b6001600160a01b0316815260208101919091526040016000205460ff1615156001146104d65760405162461bcd60e51b815260206004820152601560248201527f5374726174656779206e6f7420617070726f766564000000000000000000000060448201526064015b60405180910390fd5b60146104e860a0890160808a0161121b565b61ffff16111561053a5760405162461bcd60e51b815260206004820152601060248201527f546f6f206d616e79204b697474656e730000000000000000000000000000000060448201526064016104cd565b610549600a60c0890135611236565b8210156105985760405162461bcd60e51b815260206004820152601460248201527f4d696e2031302520726571206173207374616b6500000000000000000000000060448201526064016104cd565b6105ab670de0b6b3a764000060146111dc565b8760c0013510156105fe5760405162461bcd60e51b815260206004820152601460248201527f4d696e2024323020726571206173207374616b6500000000000000000000000060448201526064016104cd565b6001600160a01b0383166323b872dd336106206101408b016101208c0161101b565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b1681526001600160a01b03928316600482015291166024820152604481018590526064016020604051808303816000875af115801561068c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106b09190611258565b6106fc5760405162461bcd60e51b815260206004820152601260248201527f4b726561746f72207374616b65206661696c000000000000000000000000000060448201526064016104cd565b60085460ff1661070f602089018961104e565b60ff1611156107605760405162461bcd60e51b815260206004820152600c60248201527f4665657320746f6f206c6f77000000000000000000000000000000000000000060448201526064016104cd565b600854610100900460ff1661077b6040890160208a0161104e565b60ff1611156107cc5760405162461bcd60e51b815260206004820152601060248201527f44616f206665657320746f6f206c6f770000000000000000000000000000000060448201526064016104cd565b600254604051627eeac760e11b8152336004820152602481018390526000916001600160a01b03169062fdd58e90604401602060405180830381865afa15801561081a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061083e91906111c3565b1161088b5760405162461bcd60e51b815260206004820152601560248201527f4b726561746f72206e6f74207065726d6974746564000000000000000000000060448201526064016104cd565b600254604051627eeac760e11b8152336004820152600560248201526001600160a01b039091169062fdd58e90604401602060405180830381865afa1580156108d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108fc91906111c3565b156109495760405162461bcd60e51b815260206004820152600960248201527f4841524b4f4e4e454e000000000000000000000000000000000000000000000060448201526064016104cd565b6002546040517f8f3bfe2f0000000000000000000000000000000000000000000000000000000081526001600160a01b03868116600483015290911690638f3bfe2f906024016020604051808303816000875af11580156109ae573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109d29190611258565b610a1e5760405162461bcd60e51b815260206004820152601660248201527f4e6f742061626c6520746f20736574206d696e7465720000000000000000000060448201526064016104cd565b6040517fb246b1dd0000000000000000000000000000000000000000000000000000000081526001600160a01b0385169063b246b1dd90610a6c908a908a90600190339089906004016112a7565b600060405180830381600087803b158015610a8657600080fd5b505af1158015610a9a573d6000803e3d6000fd5b5050336000818152600660209081526040808320805460018101825590845292829020909201805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b038b16908117909155825190815260e08d0135918101919091529193507f6db0c3a1a19b6bdab85bf650437b7757c8359bcadf2a70ba11b9b68e774e82ff92500160405180910390a26003546040516001600160a01b038681166024830152600092169060440160408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f8d1e179b0000000000000000000000000000000000000000000000000000000017905251610baa9190611402565b6000604051808303816000865af19150503d8060008114610be7576040519150601f19603f3d011682016040523d82523d6000602084013e610bec565b606091505b5050905080610c3d5760405162461bcd60e51b815260206004820181905260248201527f4e6f742061626c6520746f20736574204b69747479506172747920726f6c652160448201526064016104cd565b6005546040517fdb0761940000000000000000000000000000000000000000000000000000000081526001600160a01b0387811660048301529091169063db07619490602401600060405180830381600087803b158015610c9d57600080fd5b505af1158015610cb1573d6000803e3d6000fd5b50969a9950505050505050505050565b6001600160a01b038116600090815260066020908152604091829020805483518184028101840190945280845260609392830182828015610d2b57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610d0d575b50505050509050919050565b6008546201000090046001600160a01b03163314610d5457600080fd5b80516001805473ffffffffffffffffffffffffffffffffffffffff199081166001600160a01b0393841617909155602083015160028054831691841691909117905560408084015160038054841691851691909117905560608401516004805484169185169190911790556080840151600580549093169316929092179055517f40386e97635538c75f9e248c3e11389fd726f2222b7bf6ec239e1f02529e47b090600090a150565b6008546201000090046001600160a01b03163314610e1a57600080fd5b6008805460ff9092166101000261ff0019909216919091179055565b600054610100900460ff16610e515760005460ff1615610e55565b303b155b610ec75760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104cd565b600054610100900460ff16158015610ee9576000805461ffff19166101011790555b6008805460647fffffffffffffffffffff0000000000000000000000000000000000000000ff00909116620100006001600160a01b0386160260ff1916171761ff0019166164001790558015610f45576000805461ff00191690555b5050565b60006040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528260601b60148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f09150506001600160a01b038116610fff5760405162461bcd60e51b815260206004820152601660248201527f455243313136373a20637265617465206661696c65640000000000000000000060448201526064016104cd565b919050565b80356001600160a01b0381168114610fff57600080fd5b60006020828403121561102d57600080fd5b61103682611004565b9392505050565b803560ff81168114610fff57600080fd5b60006020828403121561106057600080fd5b6110368261103d565b6000806040838503121561107c57600080fd5b61108583611004565b946020939093013593505050565b6000808284036101a08112156110a857600080fd5b610160808212156110b857600080fd5b849350604061015f19830112156110ce57600080fd5b92959390920193505050565b6020808252825182820181905260009190848201906040850190845b8181101561111b5783516001600160a01b0316835292840192918401916001016110f6565b50909695505050505050565b600060a0828403121561113957600080fd5b60405160a0810181811067ffffffffffffffff8211171561116a57634e487b7160e01b600052604160045260246000fd5b60405261117683611004565b815261118460208401611004565b602082015261119560408401611004565b60408201526111a660608401611004565b60608201526111b760808401611004565b60808201529392505050565b6000602082840312156111d557600080fd5b5051919050565b600081600019048311821515161561120457634e487b7160e01b600052601160045260246000fd5b500290565b803561ffff81168114610fff57600080fd5b60006020828403121561122d57600080fd5b61103682611209565b60008261125357634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561126a57600080fd5b8151801515811461103657600080fd5b6001600160a01b038061128c83611004565b1683528061129c60208401611004565b166020840152505050565b61028081016112c0826112b98961103d565b60ff169052565b6112cc6020880161103d565b60ff1660208301526112e06040880161103d565b60ff1660408301526112f46060880161103d565b60ff16606083015261130860808801611209565b61ffff16608083015261131d60a08801611209565b61ffff811660a08401525060c087013560c083015260e087013560e083015261010061134a818901611004565b6001600160a01b031690830152610120611365888201611004565b6001600160a01b031690830152610140611380888201611004565b6001600160a01b03169083015261139b61016083018761127a565b84546001600160a01b039081166101a0840152600186015481166101c0840152600286015481166101e0840152600386015481166102008401526004860154166102208301526001600160a01b038416610240830152826102608301529695505050505050565b6000825160005b818110156114235760208186018101518583015201611409565b81811115611432576000828501525b50919091019291505056fea2646970667358221220816e4ba64ba44158a3a29f4acddddf93ab957dc65da774afb346e1a114825cdb64736f6c634300080b0033";

export class KittyPartyFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<KittyPartyFactory> {
    return super.deploy(overrides || {}) as Promise<KittyPartyFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): KittyPartyFactory {
    return super.attach(address) as KittyPartyFactory;
  }
  connect(signer: Signer): KittyPartyFactory__factory {
    return super.connect(signer) as KittyPartyFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KittyPartyFactoryInterface {
    return new utils.Interface(_abi) as KittyPartyFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KittyPartyFactory {
    return new Contract(address, _abi, signerOrProvider) as KittyPartyFactory;
  }
}
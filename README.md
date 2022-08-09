# 1-kittyparty-contracts

These are the main contracts for Kitty Party Project.

## Duration related information
```
lastStageTime --> checked in every stage, it is updated at each stage
timeToCollection --> Relevant to collection only from initial start
durationInDays --> Relevant to staking period only
```

### Stages
```
InitialCollection : 0
Collection : 1
Staking : 2
Payout : 3
Completed : 4
Refund : 5
```
## Installation

####  Clone the repository

```
 git clone git@github.com:kittypartydefi/1-kittyparty-contracts.git
```

#### Install dependencies

```
 cd 1-kittyparty-contracts/hardhat
 yarn install
```

Create a .env file that has the mnemonic and other parameters as per [.env.sample](/hardhat/.env.example)
##### Running Locally
```
npx hardhat node --fork https://polygon-mainnet.g.alchemy.com/v2/tDZJwVUxsPjYjSstF0opTtvNFK6FazCj --fork-block-number 22477424
```
Then in a separate window run,
```
npx hardhat  run scripts/deploy.ts  --network localhost
```
Copy over the latest addresses to the createKitty Script
```
npx hardhat  run scripts/createKitty.ts  --network localhost
```
<br/>

## Testing
TESTS ARE IN THE PROCESS OF BEING UPGRADED
```
npx hardhat test
```

### Coverage 
Currently only covers the ideal test case for the generic Kitty Party Flow


### Subgraph 
#### Run local chain
```
cd hardhat 
```

1. Run a local node. Example:
```
 npx hardhat node --fork https://polygon-mainnet.g.alchemy.com/v2/tDZJwVUxsPjYjSstF0opTtvNFK6FazCj --fork-block-number 17409194
```

2. Deploy contracts - I have added an example of kitty joining kitty party.
```
npx hardhat --network localhost run scripts/deploy.ts
```

#### Run subgraph
```
cd ../services/graph-node
```

1. Run ./restart.sh

It should show eth_getBlockNumber in around 2-3 minutes in the blockchain terminal. If not, then retry. Sometimes there could be either permission or state cache issue with subgraph.

#### Deploy subgraph to local graph node
```
cd ../subgraph
```

Before deploying, change the address of the contracts in subgraph.yaml -> TODO:automation
```
 yarn create-local
 yarn deploy-local
```


## Deployment contract info

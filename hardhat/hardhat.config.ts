import "dotenv/config";
import '@typechain/hardhat';
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-abi-exporter";
import { HardhatUserConfig, task } from "hardhat/config";
import { removeConsoleLog } from "hardhat-preprocessor";
import "solidity-coverage"


const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test test",
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, { ethers }) => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig =  {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 800
          }
        }
      }
    ]},
  paths: {
    artifacts: '../frontend/artifacts',
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts,
      blockGasLimit: 30000000
    },
    hardhat: {
      forking: {
        enabled: true,
        url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 23740202
      },
      mining: {
        auto: true,
        // interval: [3000, 6000]
      }
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`, 
      accounts,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`, 
      accounts,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`, 
      accounts,
      gasPrice:110000000000
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`, 
      accounts,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`, 
      accounts,
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts,
    },
    matic: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts,
      gasPrice: 31000000000
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice: 30000000000,
      accounts,
    },
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== "hardhat" && bre.network.name !== "localhost"
    ),
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_KEY
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
  abiExporter: {
    path: './data/abi',
    clear: false,
    flat: true,
    spacing: 2
  }
};

export default config;

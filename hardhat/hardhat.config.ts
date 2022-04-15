import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@openzeppelin/hardhat-upgrades'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'hardhat-contract-sizer'
import { ENV } from './settings'
import { COMMON_VARIABLES_AND_FUNCTIONS } from './settings'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 12000000,
      gasPrice: "auto",
      blockGasLimit: 12000000,
    },
    rinkeby: {
      url: ENV.RINKEBY_URL || "",
      accounts:
        [
          ENV.RINKEBY_PRIVATE_KEY_OWNER == null
            ? null : ENV.RINKEBY_PRIVATE_KEY_OWNER
          // ENV.RINKEBY_PRIVATE_KEY_OTHER1 == null
          //   ? null : ENV.RINKEBY_PRIVATE_KEY_OTHER1,
        ].filter(notEmpty),
      chainId: COMMON_VARIABLES_AND_FUNCTIONS.CHAIN_IDS.RINKEBY,
    },
    matic: {
         url: ENV.MATIC_URL || "",
         accounts:[
          ENV.MATIC_PRIVATE_KEY_OWNER == null
            ? null : ENV.MATIC_PRIVATE_KEY_OWNER
          // ENV.RINKEBY_PRIVATE_KEY_OTHER1 == null
          //   ? null : ENV.RINKEBY_PRIVATE_KEY_OTHER1,
        ].filter(notEmpty),
        gasPrice: 31000000000,
        chainId: COMMON_VARIABLES_AND_FUNCTIONS.CHAIN_IDS.MATIC,
       }
    // geth_localhost: {
    //   url: 'http://127.0.0.1:8545',
    //   chainId: COMMON_VARIABLES_AND_FUNCTIONS.CHAIN_IDS.GETH_LOCALHOST,
    // },
  },
  gasReporter: {
    enabled: ENV.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    // apiKey: {
    //   rinkeby: ETHERSCAN_API_KEY
    // }
    apiKey: ENV.POLYSCAN_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  }
}

export default config

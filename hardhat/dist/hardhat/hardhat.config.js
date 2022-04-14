"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@typechain/hardhat");
require("hardhat-gas-reporter");
require("solidity-coverage");
const settings_1 = require("./settings");
const settings_2 = require("./settings");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
(0, config_1.task)('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});
function notEmpty(value) {
    return value !== null && value !== undefined;
}
const config = {
    solidity: '0.8.4',
    networks: {
        rinkeby: {
            url: settings_1.ENV.RINKEBY_URL || "",
            accounts: [
                settings_1.ENV.RINKEBY_PRIVATE_KEY_OWNER == null
                    ? null : settings_1.ENV.RINKEBY_PRIVATE_KEY_OWNER
                // ENV.RINKEBY_PRIVATE_KEY_OTHER1 == null
                //   ? null : ENV.RINKEBY_PRIVATE_KEY_OTHER1,
            ].filter(notEmpty),
            chainId: settings_2.COMMON_VARIABLES_AND_FUNCTIONS.CHAIN_IDS.RINKEBY,
        },
        // geth_localhost: {
        //   url: 'http://127.0.0.1:8545',
        //   chainId: COMMON_VARIABLES_AND_FUNCTIONS.CHAIN_IDS.GETH_LOCALHOST,
        // },
    },
    gasReporter: {
        enabled: settings_1.ENV.REPORT_GAS !== undefined,
        currency: 'USD',
    },
    etherscan: {
        // apiKey: {
        //   rinkeby: ETHERSCAN_API_KEY
        // }
        apiKey: settings_1.ENV.ETHERSCAN_API_KEY
    }
};
exports.default = config;

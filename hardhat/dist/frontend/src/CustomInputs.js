"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_IDS = exports.NETWORK_NAMES = exports.SUPPORTED_CHAIN_IDS_IN_WEB = exports.TOKEN_IMAGE_URL = exports.CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS = void 0;
// Set token image that you want to display in the website
const TOKEN_IMAGE_URL = 'https://jpyc.jp/static/media/jpyc.0d1e5d3f.png';
exports.TOKEN_IMAGE_URL = TOKEN_IMAGE_URL;
// Set network names used in hardhat
const NETWORK_NAMES = {
    MAINNET: 'mainnet',
    MATIC: 'matic',
    RINKEBY: 'rinkeby',
    GETH_LOCALHOST: 'geth_localhost',
};
exports.NETWORK_NAMES = NETWORK_NAMES;
// Set supported chain ids
const CHAIN_IDS = {
    MAINNET: 1,
    RINKEBY: 4,
    MATIC: 137,
    GETH_LOCALHOST: 31337,
};
exports.CHAIN_IDS = CHAIN_IDS;
// Specify which chain corresponds with network name
const CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS = {
    [CHAIN_IDS.MAINNET]: NETWORK_NAMES.MAINNET,
    [CHAIN_IDS.RINKEBY]: NETWORK_NAMES.RINKEBY,
    [CHAIN_IDS.MATIC]: NETWORK_NAMES.MATIC,
    [CHAIN_IDS.GETH_LOCALHOST]: NETWORK_NAMES.GETH_LOCALHOST,
};
exports.CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS = CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS;
// Set chains that you want to support in the website. The website uses this setting.
const SUPPORTED_CHAIN_IDS_IN_WEB = [
    //   CHAIN_IDS.MAINNET, // Comment out when supporting mainnet
    CHAIN_IDS.RINKEBY,
    // CHAIN_IDS.MATIC, // Comment out when supporting matic
    // CHAIN_IDS.GETH_LOCALHOST, // Comment out when testing on geth network.
];
exports.SUPPORTED_CHAIN_IDS_IN_WEB = SUPPORTED_CHAIN_IDS_IN_WEB;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantRole = exports.getERC20ContractAddress = exports.mintSimpleToken = exports.transferERC20 = exports.initialDeployAndCreateMerkleTree = exports.getRelevantContracts = exports.getERC20AmountWithDecimalsLight = exports.getERC20AmountWithDecimals = exports.formatERC20Amount = exports.upgradeToDistributerV2 = exports.setRecipientsInfo = exports.setEnv = exports.DISTRIBUTER_CONTRACT_ADDRESS = exports.ERC20_CONTRACT_ADDRESS = void 0;
const hardhat_1 = require("hardhat");
const typechain_1 = require("../typechain");
const settings_1 = require("./../settings");
const fs_1 = require("fs");
const envfile_1 = require("envfile");
const settings_2 = require("../settings");
const { createMerkleTree, ENV_ERC20_CONTRACT_ADDRESS, ENV_DISTRIBUTER_CONTRACT_ADDRESS, } = settings_2.COMMON_VARIABLES_AND_FUNCTIONS;
async function setEnv(keyValueMap, path) {
    const envRawData = await fs_1.promises.readFile(path, { encoding: 'utf-8' });
    const envData = (0, envfile_1.parse)(envRawData);
    Object.keys(keyValueMap).forEach(key => {
        envData[key] = keyValueMap[key];
    });
    await fs_1.promises.writeFile(path, (0, envfile_1.stringify)(envData));
}
exports.setEnv = setEnv;
async function setRecipientsInfo(recipientsInfo, path) {
    const json = JSON.stringify(recipientsInfo);
    await fs_1.promises.writeFile(path, json);
}
exports.setRecipientsInfo = setRecipientsInfo;
function getContractAddress() {
    var _a;
    const ERC20_CONTRACT_ADDRESS = getERC20ContractAddress();
    const DISTRIBUTER_CONTRACT_ADDRESS = (_a = settings_1.ENV[`${hardhat_1.network.name.toUpperCase()}_${ENV_DISTRIBUTER_CONTRACT_ADDRESS}`]) !== null && _a !== void 0 ? _a : null;
    return { ERC20_CONTRACT_ADDRESS, DISTRIBUTER_CONTRACT_ADDRESS };
}
function getERC20ContractAddress() {
    var _a;
    const ERC20_CONTRACT_ADDRESS = (_a = settings_1.ENV[`${hardhat_1.network.name.toUpperCase()}_${ENV_ERC20_CONTRACT_ADDRESS}`]) !== null && _a !== void 0 ? _a : null;
    return ERC20_CONTRACT_ADDRESS;
}
exports.getERC20ContractAddress = getERC20ContractAddress;
const { ERC20_CONTRACT_ADDRESS, DISTRIBUTER_CONTRACT_ADDRESS, } = getContractAddress();
exports.ERC20_CONTRACT_ADDRESS = ERC20_CONTRACT_ADDRESS;
exports.DISTRIBUTER_CONTRACT_ADDRESS = DISTRIBUTER_CONTRACT_ADDRESS;
// Mint to holder contract
async function transferERC20(options) {
    const { amount, targetAddress, owner, erc20 } = options;
    const initialMintAmount = await getERC20AmountWithDecimals(amount, erc20);
    const tx = await erc20.connect(owner).transfer(targetAddress, initialMintAmount);
    await tx.wait();
}
exports.transferERC20 = transferERC20;
async function mintSimpleToken(options) {
    const { amountWithoutDecimals, owner, erc20 } = options;
    const simpleToken = erc20;
    const initialMintAmount = await getERC20AmountWithDecimals(amountWithoutDecimals, simpleToken);
    const tx = await simpleToken.connect(owner).mint(initialMintAmount);
    await tx.wait();
}
exports.mintSimpleToken = mintSimpleToken;
async function getERC20AmountWithDecimals(amountWithoutDecimals, erc20) {
    const tokenDecimals = await erc20.decimals();
    return hardhat_1.ethers.utils.parseUnits(String(amountWithoutDecimals), tokenDecimals);
}
exports.getERC20AmountWithDecimals = getERC20AmountWithDecimals;
function getERC20AmountWithDecimalsLight(amountWithoutDecimals, tokenDecimals) {
    return hardhat_1.ethers.utils.parseUnits(String(amountWithoutDecimals), tokenDecimals);
}
exports.getERC20AmountWithDecimalsLight = getERC20AmountWithDecimalsLight;
async function formatERC20Amount(amount, erc20) {
    const tokenDecimals = await erc20.decimals();
    return hardhat_1.ethers.utils.formatUnits(amount, tokenDecimals);
}
exports.formatERC20Amount = formatERC20Amount;
async function initialDeployAndCreateMerkleTree(options) {
    const { erc20Address, owner, recipientsInfo } = options;
    let targetERC20 = null;
    if (erc20Address == null) {
        const simpleToken = await (new typechain_1.SimpleToken__factory(owner).connect(owner).deploy());
        await simpleToken.deployed();
        targetERC20 = simpleToken;
    }
    else {
        targetERC20 = typechain_1.ERC20__factory.connect(erc20Address, owner);
    }
    const tokenDecimals = await targetERC20.decimals();
    let merkleTree = createMerkleTree({
        recipientsInfo,
        tokenDecimals,
    });
    if (merkleTree == null) {
        throw new Error('Merkle Tree cannot be generated');
    }
    const Distributer = new typechain_1.SimpleMerkleDistributer__factory(owner);
    const distributer = (await hardhat_1.upgrades.deployProxy(Distributer, [targetERC20.address, merkleTree.getHexRoot()], { initializer: 'initialize(address,bytes32)' }));
    await distributer.deployed();
    return { distributer, erc20: targetERC20, merkleTree };
}
exports.initialDeployAndCreateMerkleTree = initialDeployAndCreateMerkleTree;
async function upgradeToDistributerV2(options) {
    const { distributer, owner } = options;
    const TestDistributerV2 = new typechain_1.TestSimpleMerkleDistributerV2__factory(owner);
    const testDistributerV2 = (await hardhat_1.upgrades.upgradeProxy(distributer.address, TestDistributerV2));
    await testDistributerV2.deployed();
    return testDistributerV2;
}
exports.upgradeToDistributerV2 = upgradeToDistributerV2;
async function getRelevantContracts() {
    const [owner] = await hardhat_1.ethers.getSigners();
    if (DISTRIBUTER_CONTRACT_ADDRESS == null) {
        throw new Error('Contracts address are not legit');
    }
    const distributer = (new typechain_1.SimpleMerkleDistributer__factory(owner)).attach(DISTRIBUTER_CONTRACT_ADDRESS);
    const erc20Address = await distributer.token();
    const erc20 = (new typechain_1.ERC20__factory(owner)).attach(erc20Address);
    return { erc20, distributer };
}
exports.getRelevantContracts = getRelevantContracts;
async function grantRole({ role, distributer, targetAddress, }) {
    const grantRoleTx = await distributer.grantRole(role, targetAddress);
    await grantRoleTx.wait();
}
exports.grantRole = grantRole;

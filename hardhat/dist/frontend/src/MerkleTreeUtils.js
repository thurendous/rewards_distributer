"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClaimArguments = exports.generateLeaf = exports.createMerkleTree = void 0;
const merkletreejs_1 = require("merkletreejs");
const keccak256_1 = __importDefault(require("keccak256"));
const ethers_1 = require("ethers");
// Hack: To make typescript happy
global.Buffer = require('buffer').Buffer;
function generateLeaf(address, rewardAmount, uniqueKey) {
    return Buffer.from(ethers_1.ethers.utils.solidityKeccak256(['address', 'uint256', 'string'], [address, rewardAmount, uniqueKey]).slice(2), 'hex');
}
exports.generateLeaf = generateLeaf;
function createMerkleTree(options) {
    const { recipientsInfo, tokenDecimals } = options;
    const leaves = recipientsInfo.map(({ address, rewardAmountWithoutDecimals, uniqueKey }) => {
        return generateLeaf(ethers_1.ethers.utils.getAddress(address), getERC20AmountWithDecimalsLight(rewardAmountWithoutDecimals, tokenDecimals), uniqueKey);
    });
    return new merkletreejs_1.MerkleTree(leaves, keccak256_1.default, { sortPairs: true });
}
exports.createMerkleTree = createMerkleTree;
function getClaimArguments(options) {
    const { merkleTree, recipientInfo, tokenDecimals } = options;
    const { address, rewardAmountWithoutDecimals, uniqueKey } = recipientInfo;
    const amount = getERC20AmountWithDecimalsLight(rewardAmountWithoutDecimals, tokenDecimals);
    const recipientLeaf = generateLeaf(address, amount, uniqueKey);
    const hexProof = merkleTree.getHexProof(recipientLeaf);
    return { address, amount, uniqueKey, hexProof };
}
exports.getClaimArguments = getClaimArguments;
function getERC20AmountWithDecimalsLight(amountWithoutDecimals, tokenDecimals) {
    return ethers_1.ethers.utils.parseUnits(String(amountWithoutDecimals), tokenDecimals);
}

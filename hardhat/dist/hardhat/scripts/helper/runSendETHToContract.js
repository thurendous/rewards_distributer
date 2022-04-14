"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const ethers_1 = require("ethers");
const AMOUNT_WITHOUT_DECIMALS = "0.1";
const RECIPIENT = "0x3b1F26390Db8dD9166D1a03c1499d7FBB6615f1F"; // Specify address
async function main() {
    const [owner] = await hardhat_1.ethers.getSigners();
    const tx = {
        to: RECIPIENT,
        value: ethers_1.utils.parseEther(AMOUNT_WITHOUT_DECIMALS)
    };
    const result = await owner.sendTransaction(tx);
    await result.wait();
    console.log(`Tx=${result.hash}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

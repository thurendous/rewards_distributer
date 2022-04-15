"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const contractUtils_1 = require("../../utils/contractUtils");
// Specify amounts which will be passed to distributer contract
const AMOUNT_WITHOUT_DECIMALS = 1000;
async function main() {
    const { erc20, distributer } = await (0, contractUtils_1.getRelevantContracts)();
    const balance = await erc20.balanceOf(distributer.address);
    const decimals = await erc20.decimals();
    console.log('Current contract balance:', balance, 'Decimals:', decimals);
    const [owner] = await hardhat_1.ethers.getSigners();
    await (0, contractUtils_1.transferERC20)({
        amount: AMOUNT_WITHOUT_DECIMALS,
        targetAddress: distributer.address,
        erc20,
        owner,
    });
    const balanceOfDistributer = await erc20.balanceOf(distributer.address);
    console.log('balance of distributer contract is', balanceOfDistributer.toString());
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../../settings");
const contractUtils_1 = require("../../utils/contractUtils");
const { createMerkleTree, getClaimArguments, } = settings_1.COMMON_VARIABLES_AND_FUNCTIONS;
// Before executing this script, make sure that you set the new json file.
async function main() {
    const { erc20, distributer } = await (0, contractUtils_1.getRelevantContracts)();
    const balance = await erc20.balanceOf(distributer.address);
    const tokenDecimals = await erc20.decimals();
    console.log('Current contract balance:', balance, 'Decimals:', tokenDecimals);
    const recipientsInfo = settings_1.RAW_RECIPIENTS_INFO_JSON.map(info => ({
        address: info.address,
        rewardAmountWithoutDecimals: info.amount,
        uniqueKey: info.uniqueKey
    }));
    const newMerkleTree = createMerkleTree({
        recipientsInfo,
        tokenDecimals,
    });
    const tx = await distributer.setMerkleRoot(newMerkleTree.getHexRoot());
    await tx.wait();
    const isClaimable = recipientsInfo.map(async (recipientInfo, index) => {
        const { address, amount, uniqueKey, hexProof } = getClaimArguments({
            merkleTree: newMerkleTree,
            recipientInfo,
            tokenDecimals
        });
        const [actualIsClaimable, _] = await distributer.getIsClaimable(address, amount, uniqueKey, hexProof);
        console.log('address', address, 'is', actualIsClaimable ? 'claimable' : 'not claimable', 'for', amount.toNumber());
    });
    await Promise.all(isClaimable);
    console.log('Setting new address and amount map json in frontend', recipientsInfo);
    await (0, contractUtils_1.setRecipientsInfo)(recipientsInfo, `${__dirname}/./../../../frontend/src/recipientsInfo.json`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

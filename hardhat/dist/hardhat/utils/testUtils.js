"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAllClaimToken = exports.testSetHasClaimed = exports.testIsClaimable = exports.testDistributerV2NewLogic = exports.testRecipientClaimFlow = exports.testMintSimpleToken = exports.testInitialDeployAndCreateMerkleTree = exports.testMainFlow = void 0;
const contractUtils_1 = require("./contractUtils");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const settings_1 = require("../settings");
const { createMerkleTree, getClaimArguments, } = settings_1.COMMON_VARIABLES_AND_FUNCTIONS;
async function testMintSimpleToken(options) {
    const { amountWithoutDecimals, erc20, owner } = options;
    await (0, contractUtils_1.mintSimpleToken)(options);
    const amountWithDecimals = await (0, contractUtils_1.getERC20AmountWithDecimals)(amountWithoutDecimals, erc20);
    (0, chai_1.expect)(await erc20.balanceOf(owner.address)).to.equals(amountWithDecimals);
}
exports.testMintSimpleToken = testMintSimpleToken;
// As a recipient, claim reward
async function testRecipientClaimFlow(options) {
    const { connectAs, erc20, merkleTree, distributer, recipientInfo, recipientExpectedReward, } = options;
    const tokenDecimals = await erc20.decimals();
    const { address, amount, uniqueKey, hexProof } = getClaimArguments({
        merkleTree,
        recipientInfo,
        tokenDecimals
    });
    if (options.shouldBeReverted) {
        // Check error happens and tx is reverted
        await (0, chai_1.expect)(distributer.connect(connectAs).claim(address, amount, uniqueKey, hexProof)).to.be.reverted;
    }
    else {
        // Confirm that claim operation as a recipient is as expected
        await (0, chai_1.expect)(distributer.connect(connectAs).claim(address, amount, uniqueKey, hexProof)).to.emit(distributer, 'Claim').withArgs(address, amount, uniqueKey);
        // Confirm that recipient balance increases
        const recipientBalanceWithDecimals = await erc20.balanceOf(address);
        (0, chai_1.expect)(recipientBalanceWithDecimals).to.equal((0, contractUtils_1.getERC20AmountWithDecimalsLight)(recipientExpectedReward, tokenDecimals));
    }
}
exports.testRecipientClaimFlow = testRecipientClaimFlow;
async function testInitialDeployAndCreateMerkleTree(options) {
    var _a;
    const { distributerAmountWithoutDecimals, recipientsInfo, blocklistedOperations } = options;
    const blocklistedTransferERC20ToDistributerContract = (_a = blocklistedOperations === null || blocklistedOperations === void 0 ? void 0 : blocklistedOperations.transferERC20ToDistributerContract) !== null && _a !== void 0 ? _a : false;
    const [owner] = await hardhat_1.ethers.getSigners();
    const { distributer, erc20, merkleTree, } = await (0, contractUtils_1.initialDeployAndCreateMerkleTree)({
        owner,
        recipientsInfo,
    });
    await testMintSimpleToken({
        erc20,
        owner,
        amountWithoutDecimals: distributerAmountWithoutDecimals,
    });
    if (!blocklistedTransferERC20ToDistributerContract) {
        await (0, contractUtils_1.transferERC20)({
            amount: distributerAmountWithoutDecimals,
            targetAddress: distributer.address,
            erc20: erc20,
            owner,
        });
    }
    return { distributer, erc20, merkleTree };
}
exports.testInitialDeployAndCreateMerkleTree = testInitialDeployAndCreateMerkleTree;
async function testDistributerV2NewLogic(options) {
    const { testDistributerV2 } = options;
    const expectedTestValue = 20;
    const tx = await testDistributerV2.setTestValue(expectedTestValue);
    await tx.wait();
    const actualTestValue = await testDistributerV2.getTestValue();
    (0, chai_1.expect)(actualTestValue).to.be.equals(ethers_1.BigNumber.from(expectedTestValue));
}
exports.testDistributerV2NewLogic = testDistributerV2NewLogic;
async function testMainFlow(options) {
    const { distributerAmountWithoutDecimals, recipientsInfo, pastRecipientsInfo: rawPastRecipientsInfo, blocklistedOperations, testScenarios, existingContracts, rolesInfo } = options;
    let distributer = null;
    let erc20 = null;
    let merkleTree = null;
    if (existingContracts == null) {
        const deployedData = await testInitialDeployAndCreateMerkleTree({
            distributerAmountWithoutDecimals,
            recipientsInfo,
            blocklistedOperations,
        });
        distributer = deployedData.distributer;
        erc20 = deployedData.erc20;
        merkleTree = deployedData.merkleTree;
    }
    else {
        distributer = existingContracts.distributer;
        erc20 = existingContracts.erc20;
        if (existingContracts.merkleTree == null) {
            const tokenDecimals = await erc20.decimals();
            merkleTree = createMerkleTree({
                recipientsInfo,
                tokenDecimals,
            });
            const tx = await distributer.setMerkleRoot(merkleTree.getHexRoot());
            await tx.wait();
        }
        else {
            merkleTree = existingContracts.merkleTree;
        }
    }
    if (rolesInfo != null) {
        distributer;
        const grantRoles = rolesInfo.map(async (roleInfo) => {
            distributer = distributer;
            const { isModerator, targetAddress } = roleInfo;
            const role = isModerator
                ? await distributer.MODERATOR_ROLE()
                : await distributer.DEFAULT_ADMIN_ROLE();
            await (0, contractUtils_1.grantRole)({
                role,
                distributer: distributer,
                targetAddress,
            });
        });
        await Promise.all(grantRoles);
    }
    const pastRecipientsInfo = rawPastRecipientsInfo !== null && rawPastRecipientsInfo !== void 0 ? rawPastRecipientsInfo : [];
    const duplicateRecipients = [
        recipientsInfo.map(info => info.address),
        pastRecipientsInfo.map(info => info.address),
    ].reduce((prev, current) => prev.filter(p => current.includes(p)));
    const recipientsExpectedRewards = recipientsInfo.map(recipientInfo => {
        var _a, _b;
        if (duplicateRecipients.includes(recipientInfo.address)) {
            const previousRewardAmount = (_b = (_a = pastRecipientsInfo.find(pastRecipientInfo => pastRecipientInfo.address === recipientInfo.address)) === null || _a === void 0 ? void 0 : _a.rewardAmountWithoutDecimals) !== null && _b !== void 0 ? _b : 0;
            return recipientInfo.rewardAmountWithoutDecimals + previousRewardAmount;
        }
        return recipientInfo.rewardAmountWithoutDecimals;
    });
    // Run claim first time
    await testIsClaimable({
        erc20,
        merkleTree,
        recipientsInfo,
        distributer,
        scenariosIsClaimable: testScenarios.map(s => s.isFirstGetClaimable),
    });
    const firstClaims = recipientsInfo.map(async (recipientInfo, index) => {
        return await testRecipientClaimFlow({
            connectAs: recipientInfo.connectAs,
            recipientInfo,
            recipientExpectedReward: testScenarios[index].shouldFirstClaimRevert
                ? undefined : recipientsExpectedRewards[index],
            distributer: distributer,
            shouldBeReverted: testScenarios[index].shouldFirstClaimRevert,
            merkleTree: merkleTree,
            erc20: erc20,
        });
    });
    await Promise.all(firstClaims);
    // Run claim second time
    await testIsClaimable({
        erc20,
        merkleTree,
        recipientsInfo,
        distributer,
        scenariosIsClaimable: testScenarios.map(s => s.isSecondGetClaimable),
    });
    const secondClaims = recipientsInfo.map(async (recipientInfo, index) => {
        return await testRecipientClaimFlow({
            connectAs: recipientInfo === null || recipientInfo === void 0 ? void 0 : recipientInfo.connectAs,
            recipientInfo,
            recipientExpectedReward: testScenarios[index].shouldSecondClaimRevert
                ? undefined : recipientsExpectedRewards[index],
            distributer: distributer,
            shouldBeReverted: testScenarios[index].shouldSecondClaimRevert,
            merkleTree: merkleTree,
            erc20: erc20,
        });
    });
    await Promise.all(secondClaims);
    return { distributer, merkleTree, erc20 };
}
exports.testMainFlow = testMainFlow;
async function testIsClaimable(options) {
    const { erc20, distributer, merkleTree, recipientsInfo, scenariosIsClaimable } = options;
    const tokenDecimals = await erc20.decimals();
    const isClaimable = recipientsInfo.map(async (recipientInfo, index) => {
        const { address, amount, uniqueKey, hexProof } = getClaimArguments({
            merkleTree,
            recipientInfo,
            tokenDecimals
        });
        const [actualIsClaimable, _] = await distributer.connect(recipientInfo.connectAs).getIsClaimable(address, amount, uniqueKey, hexProof);
        (0, chai_1.expect)(actualIsClaimable).to.equals(scenariosIsClaimable[index]);
    });
    await Promise.all(isClaimable);
}
exports.testIsClaimable = testIsClaimable;
async function testSetHasClaimed(options) {
    const { connectAs, distributer, merkleTree, recipientInfo, tokenDecimals, } = options;
    const { address, uniqueKey } = getClaimArguments({
        merkleTree,
        recipientInfo,
        tokenDecimals
    });
    const setHasClaimed = await distributer.connect(connectAs).setHasClaimedPerRecipientAndUniqueKey(address, uniqueKey, true);
    await setHasClaimed.wait();
}
exports.testSetHasClaimed = testSetHasClaimed;
async function testAllClaimToken({ connectAs, doesModeratorConnectAs = false, recipientInfo, }) {
    const distributerAmountWithoutDecimals = 100;
    const { distributer, erc20, } = await testInitialDeployAndCreateMerkleTree({
        distributerAmountWithoutDecimals,
        recipientsInfo: [recipientInfo],
    });
    if (doesModeratorConnectAs != null) {
        const moderatorRole = await distributer.MODERATOR_ROLE();
        await (0, contractUtils_1.grantRole)({
            role: moderatorRole,
            distributer,
            targetAddress: connectAs.address,
        });
    }
    const claimAllDepositsTx = await distributer.connect(connectAs).claimAllDiposits();
    await claimAllDepositsTx.wait();
    const distributerAmountWithDecimals = await (0, contractUtils_1.getERC20AmountWithDecimals)(distributerAmountWithoutDecimals, erc20);
    const currentBalance = await erc20.balanceOf(connectAs.address);
    (0, chai_1.expect)(currentBalance).to.equals(distributerAmountWithDecimals);
}
exports.testAllClaimToken = testAllClaimToken;

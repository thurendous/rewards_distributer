"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const contractUtils_1 = require("../utils/contractUtils");
const testUtils_1 = require("../utils/testUtils");
describe("Test using SimpleMerkleDistributer contract", () => {
    const distributerAmountWithoutDecimals = 10000;
    const recipientRewardAmount = 100;
    const uniqueKey1 = "20220901";
    const uniqueKey2 = "20230901";
    it("Correct flow - one recipient claims reward", async () => {
        const [_, recipient] = await hardhat_1.ethers.getSigners();
        // User claims their reward. Should succeed.
        const recipientsInfoAndTestScenarios = [
            {
                recipientInfo: {
                    address: recipient.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient,
                },
                testScenario: {
                    shouldFirstClaimRevert: false,
                    shouldSecondClaimRevert: true,
                    isFirstGetClaimable: true,
                    isSecondGetClaimable: false,
                },
            },
        ];
        await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            testScenarios: recipientsInfoAndTestScenarios.map(el => el.testScenario),
        });
        console.log(recipientsInfoAndTestScenarios.map(el => el.recipientInfo));
        console.log(recipientsInfoAndTestScenarios.map(el => el.testScenario));
    });
    it("Correct flow - multiple recipients claim rewards", async () => {
        const [_, recipient1, recipient2, recipient3] = await hardhat_1.ethers.getSigners();
        const commonSuccessTestScenario = {
            shouldFirstClaimRevert: false,
            shouldSecondClaimRevert: true,
            isFirstGetClaimable: true,
            isSecondGetClaimable: false,
        };
        // All test scenarios below: user tries to claim reward. All should succeed.
        const recipientsInfoAndTestScenarios = [
            {
                recipientInfo: {
                    address: recipient1.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient1,
                },
                testScenario: commonSuccessTestScenario,
            },
            {
                recipientInfo: {
                    address: recipient2.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 100,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient2,
                },
                testScenario: commonSuccessTestScenario,
            },
            {
                recipientInfo: {
                    address: recipient3.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 200,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient3,
                },
                testScenario: commonSuccessTestScenario,
            },
        ];
        await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            testScenarios: recipientsInfoAndTestScenarios.map(el => el.testScenario),
        });
    });
    it("Error flow - distributer contract does not have enough funds", async () => {
        const [_, recipient] = await hardhat_1.ethers.getSigners();
        // Scenario: recipient tries to get reward, but fail doing so.
        const recipientsInfoAndTestScenarios = [
            {
                recipientInfo: {
                    address: recipient.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient,
                },
                testScenario: {
                    shouldFirstClaimRevert: true,
                    shouldSecondClaimRevert: true,
                    // When contract does not enough funds, return true for isClaimable status.
                    isFirstGetClaimable: true,
                    isSecondGetClaimable: true,
                },
            }
        ];
        await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            blocklistedOperations: { transferERC20ToDistributerContract: true },
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            testScenarios: recipientsInfoAndTestScenarios.map(el => el.testScenario),
        });
    });
    it("Error and correct flow - recipient does not have available rewards. other recipient can claim rewards.", async () => {
        const [_, recipientNotInTree, otherRecipient1InTree, otherRecipient2InTree,] = await hardhat_1.ethers.getSigners();
        const otherRecipient1RewardAmount = recipientRewardAmount + 100;
        const otherRecipient2RewardAmount = recipientRewardAmount + 500;
        const recipientsInfoAndTestScenarios = [
            // Scenario1: recipient tries to claim other recipient's reward. should fail.
            {
                recipientInfo: {
                    address: otherRecipient1InTree.address,
                    rewardAmountWithoutDecimals: otherRecipient1RewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: recipientNotInTree,
                },
                testScenario: {
                    shouldFirstClaimRevert: true,
                    shouldSecondClaimRevert: true,
                    isFirstGetClaimable: true,
                    isSecondGetClaimable: true,
                },
            },
            // Scenario2: other recipient claims their reward. should pass.
            {
                recipientInfo: {
                    address: otherRecipient2InTree.address,
                    rewardAmountWithoutDecimals: otherRecipient2RewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: otherRecipient2InTree,
                },
                testScenario: {
                    shouldFirstClaimRevert: false,
                    shouldSecondClaimRevert: true,
                    isFirstGetClaimable: true,
                    isSecondGetClaimable: false,
                },
            }
        ];
        // Connect as recipient who is not in tree, and fail claiming reward.
        await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            testScenarios: recipientsInfoAndTestScenarios.map(el => el.testScenario),
        });
    });
    it("Correct flow - owner sets new Merkle Tree.", async () => {
        const [_owner, recipient1EligibleForFirstReward, recipient2EligibleForFirstReward, recipient3EligibleForFirstAndSecondReward, recipient4EligibleForSecondReward, recipient5EligibleForSecondReward,] = await hardhat_1.ethers.getSigners();
        const commonSuccessTestScenario = {
            shouldFirstClaimRevert: false,
            shouldSecondClaimRevert: true,
            isFirstGetClaimable: true,
            isSecondGetClaimable: false,
        };
        // Start reward distribution and claiming for first merkle tree
        // All scenarios below: users claim their reward. Should suceed.
        const firstTestScenarios = [
            {
                recipientInfo: {
                    address: recipient1EligibleForFirstReward.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient1EligibleForFirstReward,
                },
                testScenario: commonSuccessTestScenario,
            },
            {
                recipientInfo: {
                    address: recipient2EligibleForFirstReward.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 100,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient2EligibleForFirstReward,
                },
                testScenario: commonSuccessTestScenario,
            },
            {
                recipientInfo: {
                    address: recipient3EligibleForFirstAndSecondReward.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 200,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient3EligibleForFirstAndSecondReward,
                },
                testScenario: commonSuccessTestScenario,
            },
        ];
        const { distributer, erc20 } = await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            recipientsInfo: firstTestScenarios.map(el => el.recipientInfo),
            testScenarios: firstTestScenarios.map(el => el.testScenario),
        });
        // All scenarios below: If user claimed the rewards already, they cannot
        // claim the rewards again. Other than this case, test should succeed.
        const secondTestScenarios = [
            {
                recipientInfo: {
                    address: recipient3EligibleForFirstAndSecondReward.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 500,
                    uniqueKey: uniqueKey2,
                    connectAs: recipient3EligibleForFirstAndSecondReward,
                },
                testScenario: {
                    shouldFirstClaimRevert: false,
                    shouldSecondClaimRevert: true,
                    isFirstGetClaimable: true,
                    isSecondGetClaimable: false,
                },
            },
            {
                recipientInfo: {
                    address: recipient4EligibleForSecondReward.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 600,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient4EligibleForSecondReward,
                },
                testScenario: commonSuccessTestScenario,
            },
            {
                recipientInfo: {
                    address: recipient5EligibleForSecondReward.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 700,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient5EligibleForSecondReward,
                },
                testScenario: commonSuccessTestScenario,
            },
        ];
        await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            recipientsInfo: secondTestScenarios.map(el => el.recipientInfo),
            testScenarios: secondTestScenarios.map(el => el.testScenario),
            pastRecipientsInfo: firstTestScenarios.map(el => el.recipientInfo),
            // When setting existing contracts, it will use these contracts.
            existingContracts: { distributer, erc20 },
        });
    });
    it("Correct flow - owner upgrades new contract using openzeppelin's upgradeable functionality", async () => {
        const [owner, recipient1, recipient2, recipient3,] = await hardhat_1.ethers.getSigners();
        const commonSuccessTestScenarioWithoutWithdrawal = {
            shouldFirstClaimRevert: false,
            shouldSecondClaimRevert: true,
            isFirstGetClaimable: true,
            isSecondGetClaimable: false,
        };
        const recipientsInfoAndTestScenarios = [
            {
                recipientInfo: {
                    address: recipient1.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient1,
                },
                testScenario: commonSuccessTestScenarioWithoutWithdrawal,
            },
            {
                recipientInfo: {
                    address: recipient2.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 100,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient2,
                },
                testScenario: commonSuccessTestScenarioWithoutWithdrawal,
            },
            {
                recipientInfo: {
                    address: recipient3.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount + 200,
                    uniqueKey: uniqueKey1,
                    connectAs: recipient3,
                },
                testScenario: commonSuccessTestScenarioWithoutWithdrawal,
            },
        ];
        const { distributer, erc20, merkleTree } = await (0, testUtils_1.testInitialDeployAndCreateMerkleTree)({
            distributerAmountWithoutDecimals,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
        });
        await (0, testUtils_1.testIsClaimable)({
            erc20,
            merkleTree,
            distributer,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            scenariosIsClaimable: recipientsInfoAndTestScenarios.map(_ => true),
        });
        // Upgrade Distributer contract
        const testDistributerV2 = await (0, contractUtils_1.upgradeToDistributerV2)({
            distributer,
            owner
        });
        await (0, testUtils_1.testDistributerV2NewLogic)({ testDistributerV2 });
        // No one claims the reward, so use is able to claim their rewards here.
        await (0, testUtils_1.testIsClaimable)({
            erc20,
            merkleTree,
            distributer: testDistributerV2,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            scenariosIsClaimable: recipientsInfoAndTestScenarios.map(_ => true),
        });
        await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            testScenarios: recipientsInfoAndTestScenarios.map(el => el.testScenario),
            existingContracts: {
                distributer: testDistributerV2,
                erc20,
                merkleTree
            },
        });
    });
    it("Correct flow - After admin or moderator setting that recipients already claimed, recipient cannot receive it.", async () => {
        const [owner, recipient1, recipient2, recipient3, moderator,] = await hardhat_1.ethers.getSigners();
        const recipientBeingSetClaimedByAdminInfo = {
            address: recipient1.address,
            rewardAmountWithoutDecimals: recipientRewardAmount,
            uniqueKey: uniqueKey1,
            connectAs: recipient1,
        };
        const recipientBeingSetClaimedByModeratorInfo = {
            address: recipient2.address,
            rewardAmountWithoutDecimals: recipientRewardAmount,
            uniqueKey: uniqueKey1,
            connectAs: recipient2,
        };
        const recipientBeingClaimableInfo = {
            address: recipient3.address,
            rewardAmountWithoutDecimals: recipientRewardAmount,
            uniqueKey: uniqueKey1,
            connectAs: recipient3,
        };
        const { distributer, erc20, merkleTree } = await (0, testUtils_1.testInitialDeployAndCreateMerkleTree)({
            distributerAmountWithoutDecimals,
            recipientsInfo: [
                recipientBeingSetClaimedByAdminInfo,
                recipientBeingSetClaimedByModeratorInfo,
                recipientBeingClaimableInfo,
            ],
        });
        const moderatorRole = await distributer.MODERATOR_ROLE();
        await (0, contractUtils_1.grantRole)({
            role: moderatorRole,
            distributer,
            targetAddress: moderator.address,
        });
        const tokenDecimals = await erc20.decimals();
        // Connect as admin (owner), and mark recipient as claimed.
        (0, testUtils_1.testSetHasClaimed)({
            merkleTree,
            recipientInfo: recipientBeingSetClaimedByAdminInfo,
            distributer,
            tokenDecimals,
            connectAs: owner,
        });
        // Connect as admin (moderator), and mark recipient as claimed.
        (0, testUtils_1.testSetHasClaimed)({
            merkleTree,
            recipientInfo: recipientBeingSetClaimedByModeratorInfo,
            distributer,
            tokenDecimals,
            connectAs: moderator,
        });
        await (0, testUtils_1.testIsClaimable)({
            erc20,
            merkleTree,
            recipientsInfo: [
                recipientBeingSetClaimedByAdminInfo,
                recipientBeingSetClaimedByModeratorInfo,
                recipientBeingClaimableInfo,
            ],
            distributer,
            scenariosIsClaimable: [
                false,
                false,
                true, // Corresponds with recipientBeingClaimableInfo
            ],
        });
    });
    it("Correct flow - Admin can claim token from contract", async () => {
        const [owner, recipient] = await hardhat_1.ethers.getSigners();
        const recipientInfo = {
            address: recipient.address,
            rewardAmountWithoutDecimals: recipientRewardAmount,
            uniqueKey: uniqueKey1,
        };
        await (0, testUtils_1.testAllClaimToken)({
            connectAs: owner,
            recipientInfo,
        });
    });
    it("Correct flow - Moderator can claim token from contract", async () => {
        const [_, recipient, moderator] = await hardhat_1.ethers.getSigners();
        const recipientInfo = {
            address: recipient.address,
            rewardAmountWithoutDecimals: recipientRewardAmount,
            uniqueKey: uniqueKey1,
        };
        await (0, testUtils_1.testAllClaimToken)({
            connectAs: moderator,
            recipientInfo,
        });
    });
    it("Correct flow - admin or moderator can distribute reward", async () => {
        const [owner, recipient1, recipient2, moderator,] = await hardhat_1.ethers.getSigners();
        const recipientsInfoAndTestScenarios = [
            {
                recipientInfo: {
                    address: recipient1.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount,
                    uniqueKey: uniqueKey1,
                    connectAs: owner, // Check the case when connecting as owner
                },
                testScenario: {
                    shouldFirstClaimRevert: false,
                    shouldSecondClaimRevert: true,
                    isFirstGetClaimable: true,
                    isSecondGetClaimable: false,
                },
            },
            {
                recipientInfo: {
                    address: recipient2.address,
                    rewardAmountWithoutDecimals: recipientRewardAmount,
                    uniqueKey: uniqueKey2,
                    connectAs: moderator, // Check the case when connecting as moderator
                },
                testScenario: {
                    shouldFirstClaimRevert: false,
                    shouldSecondClaimRevert: true,
                    isFirstGetClaimable: true,
                    isSecondGetClaimable: false,
                },
            },
        ];
        await (0, testUtils_1.testMainFlow)({
            distributerAmountWithoutDecimals,
            recipientsInfo: recipientsInfoAndTestScenarios.map(el => el.recipientInfo),
            testScenarios: recipientsInfoAndTestScenarios.map(el => el.testScenario),
            rolesInfo: [{ targetAddress: moderator.address, isModerator: true }],
        });
    });
});

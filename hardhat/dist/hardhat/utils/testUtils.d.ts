import type { SimpleMerkleDistributer as DistributerType, TestSimpleMerkleDistributerV2 as TestDistributerV2Type, ERC20 as ERC20Type } from "../typechain";
import type { SignerWithAddress as SignerWithAddressType } from "@nomiclabs/hardhat-ethers/signers";
import type { MerkleTree as MerkleTreeType } from 'merkletreejs';
import { RecipientInfoType } from "../settings";
declare type TestScenariosType = {
    shouldFirstClaimRevert: boolean;
    shouldSecondClaimRevert: boolean;
    isFirstGetClaimable: boolean;
    isSecondGetClaimable: boolean;
};
declare type TestRecipientInfoType = RecipientInfoType & {
    connectAs: SignerWithAddressType;
};
declare function testMintSimpleToken(options: {
    amountWithoutDecimals: number;
    erc20: ERC20Type;
    owner: SignerWithAddressType;
}): Promise<void>;
declare function testRecipientClaimFlow(options: {
    connectAs: SignerWithAddressType;
    recipientInfo: RecipientInfoType;
    recipientExpectedReward?: number;
    distributer: DistributerType;
    shouldBeReverted: boolean;
    merkleTree: MerkleTreeType;
    erc20: ERC20Type;
}): Promise<void>;
declare function testInitialDeployAndCreateMerkleTree(options: {
    distributerAmountWithoutDecimals: number;
    recipientsInfo: RecipientInfoType[];
    blocklistedOperations?: {
        transferERC20ToDistributerContract?: boolean;
    };
}): Promise<{
    distributer: DistributerType;
    erc20: ERC20Type;
    merkleTree: MerkleTreeType;
}>;
declare function testDistributerV2NewLogic(options: {
    testDistributerV2: TestDistributerV2Type;
}): Promise<void>;
declare function testMainFlow(options: {
    distributerAmountWithoutDecimals: number;
    recipientsInfo: TestRecipientInfoType[];
    pastRecipientsInfo?: TestRecipientInfoType[];
    blocklistedOperations?: {
        transferERC20ToDistributerContract?: boolean;
    };
    testScenarios: TestScenariosType[];
    existingContracts?: {
        distributer: DistributerType;
        erc20: ERC20Type;
        merkleTree?: MerkleTreeType;
    };
    rolesInfo?: {
        targetAddress: string;
        isModerator: boolean;
    }[];
}): Promise<{
    distributer: DistributerType;
    merkleTree: MerkleTreeType;
    erc20: ERC20Type;
}>;
declare function testIsClaimable(options: {
    erc20: ERC20Type;
    merkleTree: MerkleTreeType;
    recipientsInfo: TestRecipientInfoType[];
    distributer: DistributerType;
    scenariosIsClaimable: boolean[];
}): Promise<void>;
declare function testSetHasClaimed(options: {
    merkleTree: MerkleTreeType;
    recipientInfo: TestRecipientInfoType;
    distributer: DistributerType;
    tokenDecimals: number;
    connectAs: SignerWithAddressType;
}): Promise<void>;
declare function testAllClaimToken({ connectAs, doesModeratorConnectAs, recipientInfo, }: {
    connectAs: SignerWithAddressType;
    doesModeratorConnectAs?: boolean;
    recipientInfo: RecipientInfoType;
}): Promise<void>;
export { testMainFlow, testInitialDeployAndCreateMerkleTree, testMintSimpleToken, testRecipientClaimFlow, testDistributerV2NewLogic, testIsClaimable, testSetHasClaimed, testAllClaimToken, };

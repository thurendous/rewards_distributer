/// <reference types="node" />
import type { BigNumber as BigNumberType } from "ethers";
import type { MerkleTree as MerkleTreeType } from 'merkletreejs';
export declare type RecipientInfoType = {
    address: string;
    rewardAmountWithoutDecimals: number;
    uniqueKey: string;
};
export declare type ClaimArgumentType = {
    address: string;
    amount: BigNumberType;
    uniqueKey: string;
    hexProof: string[];
};
declare function generateLeaf(address: string, rewardAmount: BigNumberType, uniqueKey: string): Buffer;
declare function createMerkleTree(options: {
    recipientsInfo: RecipientInfoType[];
    tokenDecimals: number;
}): MerkleTreeType;
declare function getClaimArguments(options: {
    merkleTree: MerkleTreeType;
    recipientInfo: RecipientInfoType;
    tokenDecimals: number;
}): ClaimArgumentType;
export { createMerkleTree, generateLeaf, getClaimArguments };

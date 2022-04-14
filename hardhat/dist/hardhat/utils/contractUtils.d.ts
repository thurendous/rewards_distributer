import type { SimpleMerkleDistributer as DistributerType, TestSimpleMerkleDistributerV2 as TestDistributerV2Type, ERC20 as ERC20Type } from "../typechain";
import type { SignerWithAddress as SignerWithAddressType } from "@nomiclabs/hardhat-ethers/signers";
import type { BigNumber as BigNumberType } from "ethers";
import type { MerkleTree as MerkleTreeType } from 'merkletreejs';
import type { RecipientInfoType } from '../settings';
declare function setEnv(keyValueMap: {
    [key: string]: string;
}, path: string): Promise<void>;
declare function setRecipientsInfo(recipientsInfo: RecipientInfoType[], path: string): Promise<void>;
declare function getERC20ContractAddress(): string | null;
declare const ERC20_CONTRACT_ADDRESS: string | null, DISTRIBUTER_CONTRACT_ADDRESS: string | null;
declare function transferERC20(options: {
    amount: number;
    targetAddress: string;
    erc20: ERC20Type;
    owner: SignerWithAddressType;
}): Promise<void>;
declare function mintSimpleToken(options: {
    amountWithoutDecimals: number;
    erc20: ERC20Type;
    owner: SignerWithAddressType;
}): Promise<void>;
declare function getERC20AmountWithDecimals(amountWithoutDecimals: number, erc20: ERC20Type): Promise<BigNumberType>;
declare function getERC20AmountWithDecimalsLight(amountWithoutDecimals: number, tokenDecimals: number): BigNumberType;
declare function formatERC20Amount(amount: BigNumberType, erc20: ERC20Type): Promise<string>;
declare function initialDeployAndCreateMerkleTree(options: {
    recipientsInfo: RecipientInfoType[];
    erc20Address?: string | null;
    owner: SignerWithAddressType;
}): Promise<{
    distributer: DistributerType;
    erc20: ERC20Type;
    merkleTree: MerkleTreeType;
}>;
declare function upgradeToDistributerV2(options: {
    distributer: DistributerType;
    owner: SignerWithAddressType;
}): Promise<TestDistributerV2Type>;
declare function getRelevantContracts(): Promise<{
    erc20: ERC20Type;
    distributer: DistributerType;
}>;
declare function grantRole({ role, distributer, targetAddress, }: {
    role: string;
    distributer: DistributerType;
    targetAddress: string;
}): Promise<void>;
export { ERC20_CONTRACT_ADDRESS, DISTRIBUTER_CONTRACT_ADDRESS, setEnv, setRecipientsInfo, upgradeToDistributerV2, formatERC20Amount, getERC20AmountWithDecimals, getERC20AmountWithDecimalsLight, getRelevantContracts, initialDeployAndCreateMerkleTree, transferERC20, mintSimpleToken, getERC20ContractAddress, grantRole, };

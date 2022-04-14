import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { AbstractMerkleDistributer, AbstractMerkleDistributerInterface } from "../AbstractMerkleDistributer";
export declare class AbstractMerkleDistributer__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): AbstractMerkleDistributerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): AbstractMerkleDistributer;
}

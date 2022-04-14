/// <reference types="node" />
import * as COMMON_VARIABLES_AND_FUNCTIONS from './commonVariablesAndFunctionsAdapter';
declare const PATH_TO_HARDHAT_ENV: string;
declare const PATH_TO_FRONTEND_ENV: string;
declare const RAW_RECIPIENTS_INFO_JSON: {
    address: string;
    amount: number;
    uniqueKey: string;
}[];
declare const PATH_TO_REACT_ROOT_RECIPIENTS_INFO_JSON: string;
declare const ENV: NodeJS.ProcessEnv;
export declare type RecipientInfoType = COMMON_VARIABLES_AND_FUNCTIONS.RecipientInfoType;
export { ENV, PATH_TO_HARDHAT_ENV, PATH_TO_FRONTEND_ENV, RAW_RECIPIENTS_INFO_JSON, PATH_TO_REACT_ROOT_RECIPIENTS_INFO_JSON, COMMON_VARIABLES_AND_FUNCTIONS, };

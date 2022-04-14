"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../settings");
const { getClaimArguments, ENV_PREFIX_REACT_APP, ENV_DISTRIBUTER_CONTRACT_ADDRESS, } = settings_1.COMMON_VARIABLES_AND_FUNCTIONS;
/***** Change following values based on your needs *****/
const INITIAL_MINT_AMOUNT_WITHOUT_DECIMALS = 3;
const SHOULD_RECIPIENT_CLAIM_REWARD = true;
const SHOULD_GENERATE_ENV_FILE = true;
const SHOULD_GENERATE_JSON_FOR_TARGET_RECIPIENTS = true;
const SHOULD_USE_JSON_FOR_TARGET_RECIPIENTS = true;
const SHOULD_USE_EXTERNAL_ERC20_TOKEN = true; // Set true if you want to use external token address
/*
 * This script deploys contracts using ERC20 token. In local mode, it uses
 * SimpleToken ERC20 contracts automatically. In other environments, it uses
 * ERC20 token that dev specified in .env.
 */
async function main() {
    let distributer = null;
}
function getYesOrNo(value) {
    return value ? "Yes" : "No";
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

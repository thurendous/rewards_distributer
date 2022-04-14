"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_VARIABLES_AND_FUNCTIONS = exports.PATH_TO_REACT_ROOT_RECIPIENTS_INFO_JSON = exports.RAW_RECIPIENTS_INFO_JSON = exports.PATH_TO_FRONTEND_ENV = exports.PATH_TO_HARDHAT_ENV = exports.ENV = void 0;
const dotenv = __importStar(require("dotenv"));
const COMMON_VARIABLES_AND_FUNCTIONS = __importStar(require("./commonVariablesAndFunctionsAdapter"));
exports.COMMON_VARIABLES_AND_FUNCTIONS = COMMON_VARIABLES_AND_FUNCTIONS;
const PATH_TO_HARDHAT_ENV = `${__dirname}/.env`;
exports.PATH_TO_HARDHAT_ENV = PATH_TO_HARDHAT_ENV;
dotenv.config({ path: PATH_TO_HARDHAT_ENV });
const PATH_TO_FRONTEND_ENV = `${__dirname}/./../frontend/.env`;
exports.PATH_TO_FRONTEND_ENV = PATH_TO_FRONTEND_ENV;
const RAW_RECIPIENTS_INFO_JSON = require(`${__dirname}/rawRecipientsInfo.json`);
exports.RAW_RECIPIENTS_INFO_JSON = RAW_RECIPIENTS_INFO_JSON;
const PATH_TO_REACT_ROOT_RECIPIENTS_INFO_JSON = `${__dirname}/./../frontend/src/recipientsInfo.json`;
exports.PATH_TO_REACT_ROOT_RECIPIENTS_INFO_JSON = PATH_TO_REACT_ROOT_RECIPIENTS_INFO_JSON;
const ENV = process.env;
exports.ENV = ENV;

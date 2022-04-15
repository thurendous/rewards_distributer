declare const TOKEN_IMAGE_URL = "https://jpyc.jp/static/media/jpyc.0d1e5d3f.png";
declare const NETWORK_NAMES: {
    MAINNET: string;
    MATIC: string;
    RINKEBY: string;
    GETH_LOCALHOST: string;
};
declare const CHAIN_IDS: {
    MAINNET: number;
    RINKEBY: number;
    MATIC: number;
    GETH_LOCALHOST: number;
};
declare const CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS: {
    [chainID: number]: string;
};
declare const SUPPORTED_CHAIN_IDS_IN_WEB: number[];
export { CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS, TOKEN_IMAGE_URL, SUPPORTED_CHAIN_IDS_IN_WEB, NETWORK_NAMES, CHAIN_IDS, };

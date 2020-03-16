interface NetworkSpecificConfigs {
    rpcUrl: string;
    networkId: number;
    chainId: number;
}

export const TX_DEFAULTS = { gas: 800000, gasPrice: 1000000000 };
export const MNEMONIC = 'concert load couple harbor equip island argue ramp clarify fence smart topic';
export const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
export const GANACHE_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'http://127.0.0.1:8545',
    networkId: 50,
    chainId: 1337,
};
export const KOVAN_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'https://kovan.infura.io/',
    networkId: 42,
    chainId: 42,
};
export const ROPSTEN_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'https://ropsten.infura.io/',
    networkId: 3,
    chainId: 3,
};
export const RINKEBY_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'https://rinkeby.infura.io/',
    networkId: 4,
    chainId: 4,
};
export const NETWORK_CONFIGS = GANACHE_CONFIGS; // or KOVAN_CONFIGS or ROPSTEN_CONFIGS or RINKEBY_CONFIGS
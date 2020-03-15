import { runMigrationsOnceAsync } from '@0x/migrations';
import { Web3Wrapper } from '@0x/web3-wrapper';
// tslint:disable-next-line:no-implicit-dependencies

import { GANACHE_CONFIGS, NETWORK_CONFIGS, TX_DEFAULTS } from '../src/libZeroEx/configs';
import { providerEngine } from '../src/libZeroEx/provider_engine';


export const runMigrationsOnceIfRequiredAsync = async (): Promise<void> => {
    if (NETWORK_CONFIGS === GANACHE_CONFIGS) {
        const web3Wrapper = new Web3Wrapper(providerEngine);
        const [owner] = await web3Wrapper.getAvailableAddressesAsync();
        await runMigrationsOnceAsync(providerEngine, { from: owner });
    }
};

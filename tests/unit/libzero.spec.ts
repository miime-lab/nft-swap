import  { ERC1155token} from '../../src/plugins/libZeroEx/libZeroEx';
import LibZeroEx  from '../../src/plugins/libZeroEx/libZeroEx';
import {BigNumber} from '0x.js';
import { providerEngine } from './zeroEx/provider_engine';
const libZeroEx=new LibZeroEx(providerEngine)
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
describe('createERC1155encodedData', () => {
    it('can create erc1155', ()=>{
        console.log(libZeroEx)
        const token:ERC1155token = {
            contractAddress: NULL_ADDRESS,
            tokenId:[new BigNumber(1123), new BigNumber(1124)],
            amount:[new BigNumber(1), new BigNumber(1)]
        }
        const data:any = libZeroEx.createSingleERC1155AssetData(token)
        console.log(data)
    })
})

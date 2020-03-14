import { assetDataUtils, generatePseudoRandomSalt } from "@0x/order-utils";
import { ContractWrappers, ERC721TokenContract } from "@0x/contract-wrappers";
import { dummyERC721TokenContracts } from "./contracts";
import { Web3Wrapper } from "@0x/web3-wrapper";
import libZeroEx from "../index";
import { BigNumber } from "@0x/utils";
import {
  calculateProtocolFee,
  getRandomFutureDateInSeconds,
  runMigrationsOnceIfRequiredAsync
} from "../utils";
import { PrintUtils } from "./print_utils";
import { providerEngine } from "../provider_engine";
import { NETWORK_CONFIGS, TX_DEFAULTS } from "../configs";
import { AddressDataType } from "@0x/utils/lib/src/abi_encoder/evm_data_types/address";
async function prepareForTest() {}

const LibZeroEx = new libZeroEx(providerEngine);
const contractWrappers = LibZeroEx.contractWrappers
const web3Wrapper = new Web3Wrapper(providerEngine);
const takerAssetAmount = new BigNumber(1);
const tokenId1 = generatePseudoRandomSalt();
const tokenId2 = generatePseudoRandomSalt();
const tokenId3 = generatePseudoRandomSalt();
const tokenId4 = generatePseudoRandomSalt();
const etherTokenAddress = contractWrappers.contractAddresses.etherToken;


let dummyERC721TokenContract:any;
let maker: any;
let taker: any;
let orderBaseInfo: any;
let printUtils:PrintUtils

beforeAll(async () => {
  await runMigrationsOnceIfRequiredAsync();
  [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
  printUtils = new PrintUtils(web3Wrapper, contractWrappers, { maker, taker }, { WETH: etherTokenAddress });
  printUtils.printAccounts();
  dummyERC721TokenContract = dummyERC721TokenContracts[0];
  if (!dummyERC721TokenContract) {
    console.log("No Dummy ERC721 Tokens deployed on this network");
  }
  // Mint a new ERC721 token for the maker
  const mintTxHash1 = await dummyERC721TokenContract
    .mint(maker, tokenId1)
    .sendTransactionAsync({ from: maker });
  const mintTxHash2 = await dummyERC721TokenContract
    .mint(maker, tokenId2)
    .sendTransactionAsync({ from: maker });
  const mintTxHash3 = await dummyERC721TokenContract
    .mint(taker, tokenId3)
    .sendTransactionAsync({ from: taker });
  const mintTxHash4 = await dummyERC721TokenContract
    .mint(taker, tokenId4)
    .sendTransactionAsync({ from: taker });

    console.log("owner tokenid1:",await dummyERC721TokenContract.ownerOf(tokenId1).callAsync())
    console.log("owner tokenid2:",await dummyERC721TokenContract.ownerOf(tokenId2).callAsync())
    console.log("owner tokenid3:",await dummyERC721TokenContract.ownerOf(tokenId3).callAsync())
    console.log("owner tokenid4:",await dummyERC721TokenContract.ownerOf(tokenId4).callAsync())

  orderBaseInfo = {
    makerAddress: maker,
    makerTokenData: [
      {
        contractAddress: dummyERC721TokenContract.address,
        tokenId: tokenId1
      },
      {
        contractAddress: dummyERC721TokenContract.address,
        tokenId: tokenId2
      }
    ],
    takerAddress: taker,
    takerTokenData: [
      {
        contractAddress: dummyERC721TokenContract.address,
        tokenId: tokenId3
      }
    ]
  };
},50000);

test("Create Single AssetData.", () => {
  const tokenData = orderBaseInfo.makerTokenData[0];
  const encodedData = LibZeroEx.createSingleAssetData(tokenData);
  const decodedData = assetDataUtils.decodeERC721AssetData(encodedData);
  expect(decodedData.tokenAddress).toBe(tokenData.contractAddress);
  //why decodedData.tokenId is not bignumber??
  expect(decodedData.tokenId.toString()).toBe(tokenData.tokenId.toString());
});

test("Create OrderJson", async () => {
  const orderJson = LibZeroEx.createOrderJson(orderBaseInfo);
  expect(orderJson.makerAddress).toBe(orderBaseInfo.makerAddress);
  const decodedSingleData = assetDataUtils.decodeERC721AssetData(
    orderJson.takerAssetData
  );
  expect(decodedSingleData.tokenAddress).toBe(
    dummyERC721TokenContract.address
  );
});
test("Fill Order", async () => {
  await LibZeroEx.setApprovalForAll(dummyERC721TokenContract.address, maker);
  await LibZeroEx.setApprovalForAll(dummyERC721TokenContract.address, taker);
  const orderJson = LibZeroEx.createOrderJson(orderBaseInfo);
  const signedData = await LibZeroEx.sign(orderJson, maker);
  const txHash = await LibZeroEx.fillOrder(signedData, taker, takerAssetAmount);
  
  expect(await dummyERC721TokenContract.ownerOf(tokenId1).callAsync()).toBe(taker)  
  expect(await dummyERC721TokenContract.ownerOf(tokenId2).callAsync()).toBe(taker)  
  expect(await dummyERC721TokenContract.ownerOf(tokenId3).callAsync()).toBe(maker)  
});

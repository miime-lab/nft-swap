import { assetDataUtils, generatePseudoRandomSalt } from "@0x/order-utils";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from "@0x/web3-wrapper";
import libZeroEx from "../../../src/plugins/libZeroEx/libZeroEx";
import { providerEngine } from "../../../src/plugins/libZeroEx/provider_engine";
import { dummyERC721TokenContracts } from "./contracts";
//Ganeche runner for testing
import { runMigrationsOnceIfRequiredAsync } from "./utils";
import { PrintUtils } from "./print_utils";

const LibZeroEx = new libZeroEx(providerEngine);
const contractWrappers = LibZeroEx.contractWrappers;
const web3Wrapper = new Web3Wrapper(providerEngine);
const takerAssetAmount = new BigNumber(1);
const tokenId1 = generatePseudoRandomSalt();
const tokenId2 = generatePseudoRandomSalt();
const tokenId3 = generatePseudoRandomSalt();
const tokenId4 = generatePseudoRandomSalt();
const etherTokenAddress = contractWrappers.contractAddresses.etherToken;
const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);
const etherToken = contractWrappers.weth9;
  

let dummyERC721TokenContract: any;
let maker: any;
let taker: any;
let orderBaseInfo: any;

let orderBaseInfoERC20: any;
let printUtils: PrintUtils;

beforeAll(async () => {
  await runMigrationsOnceIfRequiredAsync();
  [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
  printUtils = new PrintUtils(
    web3Wrapper,
    contractWrappers,
    { maker, taker },
    { WETH: etherTokenAddress }
  );
  await printUtils.printAccounts();
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

  console.log(
    "owner tokenid1:",
    await dummyERC721TokenContract.ownerOf(tokenId1).callAsync()
  );
  console.log(
    "owner tokenid2:",
    await dummyERC721TokenContract.ownerOf(tokenId2).callAsync()
  );
  console.log(
    "owner tokenid3:",
    await dummyERC721TokenContract.ownerOf(tokenId3).callAsync()
  );
  console.log(
    "owner tokenid4:",
    await dummyERC721TokenContract.ownerOf(tokenId4).callAsync()
  );
  

  // Convert ETH into WETH for maker by depositing ETH into the WETH contract
  const makerWETHDepositTxHash = await etherToken
    .deposit()
    .sendTransactionAsync({
      from: maker,
      value: new BigNumber(1000000000000000000)
    });
  // Convert ETH into WETH for taker by depositing ETH into the WETH contract
  const takerWETHDepositTxHash = await etherToken
    .deposit()
    .sendTransactionAsync({
      from: taker,
      value: new BigNumber(1000000000000000000)
    });
  await printUtils.awaitTransactionMinedSpinnerAsync(
    "Maker WETH Deposit",
    takerWETHDepositTxHash
  );
  orderBaseInfo = {
    maker: {
      address: maker,
      tokensERC721: [
        {
          contractAddress: dummyERC721TokenContract.address,
          tokenId: tokenId1
        },
        {
          contractAddress: dummyERC721TokenContract.address,
          tokenId: tokenId2
        }
      ],
      tokenERC20: undefined
    },
    taker: {
      address: taker,
      tokensERC721: [
        {
          contractAddress: dummyERC721TokenContract.address,
          tokenId: tokenId3
        }
      ],
      tokenERC20: undefined
    }
  };
  orderBaseInfoERC20 = {
    maker: {
      address: maker,
      tokensERC721: [
        {
          contractAddress: dummyERC721TokenContract.address,
          tokenId: tokenId3
        }
      ],
      tokenERC20: {
        contractAddress: etherTokenAddress,
        amount: new BigNumber(100000000000)
      }
    },
    taker: {
      address: taker,
      tokensERC721: [
        {
          contractAddress: dummyERC721TokenContract.address,
          tokenId: tokenId2
        }
      ],
      tokenERC20: undefined
    }
  };
}, 5000000);

test("Create Single AssetData.", async () => {
  const tokenData = orderBaseInfo.maker.tokensERC721[0];
  const encodedData = LibZeroEx.createSingleAssetData(tokenData);
  const decodedData = assetDataUtils.decodeERC721AssetData(encodedData);
  expect(decodedData.tokenAddress).toBe(tokenData.contractAddress);
  //why decodedData.tokenId is not bignumber??
  expect(decodedData.tokenId.toString()).toBe(tokenData.tokenId.toString());
});

test("Create OrderJson", async () => {
  const orderJson = await LibZeroEx.createOrderJson(orderBaseInfo);
  expect(orderJson.makerAddress).toBe(orderBaseInfo.maker.address);
  const decodedSingleData = assetDataUtils.decodeERC721AssetData(
    orderJson.takerAssetData
  );
  expect(decodedSingleData.tokenAddress).toBe(dummyERC721TokenContract.address);
});
test("Fill Order", async () => {
  await LibZeroEx.setApprovalForAll(dummyERC721TokenContract.address, maker);
  await LibZeroEx.setApprovalForAll(dummyERC721TokenContract.address, taker);
  const orderJson = await LibZeroEx.createOrderJson(orderBaseInfo);
  const signedData = await LibZeroEx.sign(orderJson, maker);
  const txHash = await LibZeroEx.fillOrder(signedData, taker, takerAssetAmount);
  console.log(
    "tokenId1 owner afetr:",
    await dummyERC721TokenContract.ownerOf(tokenId1).callAsync()
  );
  expect(await dummyERC721TokenContract.ownerOf(tokenId1).callAsync()).toBe(
    taker
  );
  expect(await dummyERC721TokenContract.ownerOf(tokenId2).callAsync()).toBe(
    taker
  );
  expect(await dummyERC721TokenContract.ownerOf(tokenId3).callAsync()).toBe(
    maker
  );
});
test("Fill Order Mix erc20 erc721", async () => {
  //makerr
  const makerWETHApprovalTxHash = await etherToken
    .approve(
      contractWrappers.contractAddresses.erc20Proxy,
      UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    )
    .sendTransactionAsync({ from: maker });
  await printUtils.awaitTransactionMinedSpinnerAsync(
    "Maker WETH Approval",
    makerWETHApprovalTxHash
  );
  //taker
  const takerWETHApprovalTxHash = await etherToken
    .approve(
      contractWrappers.contractAddresses.erc20Proxy,
      UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    )
    .sendTransactionAsync({ from: taker });
  await LibZeroEx.setApprovalForAll(dummyERC721TokenContract.address, maker);
  await LibZeroEx.setApprovalForAll(dummyERC721TokenContract.address, taker);
  const orderJson = await LibZeroEx.createOrderJson(orderBaseInfoERC20);
  console.log(orderJson)
  const signedData = await LibZeroEx.sign(orderJson, maker);
  const txHash = await LibZeroEx.fillOrder(signedData, taker, takerAssetAmount);
  console.log(
    "tokenId1 owner afetr:",
    await dummyERC721TokenContract.ownerOf(tokenId1).callAsync()
  );
  
});

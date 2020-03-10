import {
  assetDataUtils,
  Order,
  generatePseudoRandomSalt
} from "@0x/order-utils";

import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { ContractWrappers, ERC721TokenContract } from "@0x/contract-wrappers";
import {
  NULL_ADDRESS,
  NULL_BYTES,
  ZERO,
  TEN_MINUTES_MS,
  ONE_SECOND_MS
} from "./constants";

const randomExpiration = new BigNumber(Date.now() + TEN_MINUTES_MS)
  .div(ONE_SECOND_MS)
  .integerValue(BigNumber.ROUND_CEIL);

const config = {
  chainId: 1,
  exchangeAddress: "xxxxxxxx"
};

type tokenData = {
  contractAddress: string;
  tokenId: BigNumber;
};

type orderBaseInfo = {
  makerAddress: string;
  makerTokenData: tokenData[];
  takerAddress: string;
  takerTokenData: tokenData[];
};

export function createSingleAssetData(token: tokenData): string {
  const makerAssetData = assetDataUtils.encodeERC721AssetData(
    token.contractAddress,
    token.tokenId
  );
  return makerAssetData;
}

export function createMultiAssetData(tokens: tokenData[]): string {
  const encodedDatas = tokens.map(createSingleAssetData);
  const encodedMultiDatas = assetDataUtils.encodeMultiAssetData(
    //is this for erc20??? if erc721 always 1??
    [new BigNumber(1), new BigNumber(1)],
    encodedDatas
  );
  return encodedMultiDatas;
}

export function createOrderJson(orderBaseInfo: orderBaseInfo): Order {
  const makerAssetData = createMultiAssetData(orderBaseInfo.makerTokenData);
  const takerAssetData = createMultiAssetData(orderBaseInfo.takerTokenData);
  const order: Order = {
    chainId: config.chainId,
    exchangeAddress: config.exchangeAddress,
    makerAddress: orderBaseInfo.makerAddress,
    takerAddress: orderBaseInfo.takerAddress,
    senderAddress: NULL_ADDRESS,
    feeRecipientAddress: NULL_ADDRESS,
    expirationTimeSeconds: randomExpiration,
    salt: generatePseudoRandomSalt(),
    makerAssetAmount: new BigNumber(orderBaseInfo.makerTokenData.length),
    takerAssetAmount: new BigNumber(orderBaseInfo.takerTokenData.length),
    makerAssetData: makerAssetData,
    takerAssetData: takerAssetData,
    makerFeeAssetData: NULL_BYTES,
    takerFeeAssetData: NULL_BYTES,
    makerFee: ZERO,
    takerFee: ZERO
  };
  return order;
}

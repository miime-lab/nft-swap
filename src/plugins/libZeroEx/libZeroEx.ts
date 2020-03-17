import {
    assetDataUtils,
    Order,
    generatePseudoRandomSalt,
    SignedOrder,
    signatureUtils
} from "@0x/order-utils";
import { BigNumber } from "@0x/utils";
import { Web3ProviderEngine } from "@0x/migrations";
import { ContractWrappers, ERC721TokenContract } from "@0x/contract-wrappers";
import { NETWORK_CONFIGS, TX_DEFAULTS } from "./configs";
import { Web3Wrapper } from "@0x/web3-wrapper";

//constants
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NULL_BYTES = "0x";
const ZERO = new BigNumber(0);
const randomExpiration = new BigNumber(Date.now() + TEN_MINUTES_MS)
    .div(ONE_SECOND_MS)
    .integerValue(BigNumber.ROUND_CEIL);

//types
export type tokenERC721 = {
  contractAddress: string;
  tokenId: BigNumber;
};
export type tokenERC20 = {
  contractAddress: string;
  amount: BigNumber;
};

export type orderInfoOneSide = {
  address: string;
  tokensERC721: tokenERC721[];
  tokenERC20: tokenERC20 | undefined;
};

export type orderInfo = {
  maker: orderInfoOneSide;
  taker: orderInfoOneSide;
};

export default class libZeroEx {
  providerEngine: Web3ProviderEngine;
  public contractWrappers: ContractWrappers;
  public constructor(providerEngine: Web3ProviderEngine) {
      this.providerEngine = providerEngine;
      this.contractWrappers = new ContractWrappers(providerEngine, {
          chainId: NETWORK_CONFIGS.chainId
      });
  }
  public createSingleAssetData(token: tokenERC721): string {
      const makerAssetData = assetDataUtils.encodeERC721AssetData(
          token.contractAddress,
          token.tokenId
      );
      return makerAssetData;
  }

  public async createSingleTokenData(token: tokenERC20): Promise<string> {
      const tokenData = await this.contractWrappers.devUtils
          .encodeERC20AssetData(token.contractAddress)
          .callAsync();
      return tokenData;
  }

  public createMultiAssetData(tokensERC721: tokenERC721[]): string {
      const encodedDatas = tokensERC721.map(this.createSingleAssetData);
      const encodedMultiDatas = assetDataUtils.encodeMultiAssetData(
      //is this for erc20??? if erc721 always 1??
          [new BigNumber(1), new BigNumber(1)],
          encodedDatas
      );
      return encodedMultiDatas;
  }
  public async createMixAssetData(
      tokensERC721: tokenERC721[],
      tokenERC20: tokenERC20
  ): Promise<string> {
      console.log(tokenERC20)
      const encodedTokenData = await this.createSingleTokenData(tokenERC20);
      console.log(encodedTokenData)
      let encodedDatas;
      if (tokensERC721.length > 1) {
          console.log("multi erc721")
          encodedDatas = [
              this.createMultiAssetData(tokensERC721),
              encodedTokenData
          ];
      } else {
          console.log("single erc20")
          encodedDatas = [
              this.createSingleAssetData(tokensERC721[0]),
              encodedTokenData
          ];
      }
      console.log(tokenERC20.amount);
      const encodedMixDatas = assetDataUtils.encodeMultiAssetData(
      //is this for erc20??? if erc721 always 1??
          [new BigNumber(1), tokenERC20.amount],
          encodedDatas
      );
      return encodedMixDatas;
  }

  public async createAssetData(data: orderInfoOneSide) {
      if (data.tokenERC20 !== undefined) {
          return await this.createMixAssetData(data.tokensERC721, data.tokenERC20);
      } else if (data.tokensERC721.length > 1) {
          return this.createMultiAssetData(data.tokensERC721);
      } else {
          return await this.createSingleAssetData(data.tokensERC721[0]);
      }
  }

  public async createOrderJson(orderInfo: orderInfo): Promise<Order> {
      console.log(orderInfo);
      const makerAssetData = await this.createAssetData(orderInfo.maker);
      const takerAssetData = await this.createAssetData(orderInfo.taker);
      console.log(makerAssetData)
      const order: Order = {
          chainId: NETWORK_CONFIGS.chainId,
          exchangeAddress: this.contractWrappers.contractAddresses.exchange,
          makerAddress: orderInfo.maker.address,
          takerAddress: orderInfo.taker.address,
          senderAddress: NULL_ADDRESS,
          feeRecipientAddress: this.contractWrappers.contractAddresses.exchange,
          expirationTimeSeconds: randomExpiration,
          salt: generatePseudoRandomSalt(),
          makerAssetAmount: new BigNumber(1),
          takerAssetAmount: new BigNumber(1),
          makerAssetData: makerAssetData,
          takerAssetData: takerAssetData,
          makerFeeAssetData: NULL_BYTES,
          takerFeeAssetData: NULL_BYTES,
          makerFee: ZERO,
          takerFee: ZERO
      };
      return order;
  }

  public async sign(order: Order, maker: string): Promise<SignedOrder> {
      const signedOrder = await signatureUtils.ecSignOrderAsync(
          this.providerEngine,
          order,
          maker
      );
      return signedOrder;
  }
  public verifySign(): boolean {
      //signatureUtils.isValidECSignature()
      return false;
  }

  public async setApprovalForAll(
      contractAddress: string,
      makerAddress: string
  ): Promise<string> {
      const erc721Token = new ERC721TokenContract(
          contractAddress,
          this.providerEngine
      );
      const makerERC721ApprovalTxHash = await erc721Token
          .setApprovalForAll(
              this.contractWrappers.contractAddresses.erc721Proxy,
              true
          )
          .sendTransactionAsync({ from: makerAddress });
      return makerERC721ApprovalTxHash;
  }

  public async fillOrder(
      signedOrder: SignedOrder,
      taker: string,
      takerAssetAmount: BigNumber
  ): Promise<string> {
      const txHash = await this.contractWrappers.exchange
          .fillOrder(signedOrder, takerAssetAmount, signedOrder.signature)
          .sendTransactionAsync({
              from: taker,
              ...TX_DEFAULTS,
              value: this.calculateProtocolFee([signedOrder])
          });
      return txHash;
  }

  calculateProtocolFee(
      orders: SignedOrder[],
      gasPrice: BigNumber | number = TX_DEFAULTS.gasPrice
  ): BigNumber {
      return new BigNumber(150000).times(gasPrice).times(orders.length);
  }
}

// expirationDateの追加
// ・インスタンス化するとき、メタマスク等のプロバイダーを設定できるようにする
// ・tokensERC1155の追加（できれば）
// ・createMultiAssetDataとcreateMixAssetDataはひとつにまとめたい（どちらもmultiAssetData） 
// ・…とここまで書いて、createMixAssetDataって内部だけで使う関数ですかね。であれば、publicじゃないほうがいいかも

import {
    assetDataUtils,
    Order,
    generatePseudoRandomSalt,
    SignedOrder,
    signatureUtils,
    BigNumber,
    Web3ProviderEngine,
    ERC721TokenContract,
    ERC20TokenContract,
} from "0x.js";
import { ContractWrappers } from "@0x/contract-wrappers";
import { NETWORK_CONFIGS, TX_DEFAULTS } from "./configs";

//constants
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
const THREE_DAYS_MS = ONE_MINUTE_MS * 60 * 24 * 3;
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NULL_BYTES = "0x";
const ZERO = new BigNumber(0);
const MAX_ALLOWANCE = new BigNumber(2 ** 255).minus(1);

//types
export type ERC721token = {
  contractAddress: string;
  tokenId: BigNumber;
};
export type ERC1155token = {
  contractAddress: string;
  tokenId: BigNumber;
  amount: BigNumber;
}
export type tokenERC20 = {
  contractAddress: string;
  amount: BigNumber;
};

export type orderInfoOneSide = {
  address: string;
  tokensERC721: ERC721token[];
  tokenERC20: tokenERC20 | undefined;
};

export type orderInfo = {
  maker: orderInfoOneSide;
  taker: orderInfoOneSide;
};

export default class libZeroEx {
  providerEngine: Web3ProviderEngine;
  chainId: number;
  public contractWrappers: ContractWrappers;
  public constructor(providerEngine: Web3ProviderEngine, chainId?: number) {
      this.providerEngine = providerEngine;
      this.chainId = chainId || 1;
      this.contractWrappers = new ContractWrappers(providerEngine, {
          chainId: this.chainId
      });
  }
  public setProviderEngine(providerEngine: Web3ProviderEngine, chainId?: number) {
      this.providerEngine = providerEngine;
      this.chainId = chainId || this.chainId || 1;
      this.contractWrappers = new ContractWrappers(providerEngine, {
          chainId: chainId || 1
      });
  }
  public createSingleERC721AssetData(token: ERC721token): string {
      const makerAssetData = assetDataUtils.encodeERC721AssetData(
          token.contractAddress,
          token.tokenId
      );
      return makerAssetData;
  }

  public async createSingleERC20AssetData(token: tokenERC20): Promise<string> {
      const tokenData = assetDataUtils.encodeERC20AssetData(
          token.contractAddress
      );
      return tokenData;
  }

  public createMultiAssetData(tokensERC721: ERC721token[]): string {
      const encodedDatas = tokensERC721.map(this.createSingleERC721AssetData);
      const encodedMultiDatas = assetDataUtils.encodeMultiAssetData(
          [new BigNumber(1), new BigNumber(1)],
          encodedDatas
      );
      return encodedMultiDatas;
  }
  public async createMixAssetData(
      tokensERC721: ERC721token[],
      tokenERC20: tokenERC20
  ): Promise<string> {
      console.log(tokenERC20)
      const encodedTokenData = await this.createSingleERC20AssetData(tokenERC20);
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
              this.createSingleERC721AssetData(tokensERC721[0]),
              encodedTokenData
          ];
      }
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
          return await this.createSingleERC721AssetData(data.tokensERC721[0]);
      }
  }

  public async createOrderJson(orderInfo: orderInfo): Promise<Order> {
      const makerAssetData = await this.createAssetData(orderInfo.maker);
      const takerAssetData = await this.createAssetData(orderInfo.taker);
      const expirationTimeSeconds = new BigNumber(Date.now() + THREE_DAYS_MS)
          .div(ONE_SECOND_MS)
          .integerValue(BigNumber.ROUND_CEIL);
      const order: Order = {
          chainId: this.chainId,
          exchangeAddress: this.contractWrappers.contractAddresses.exchange,
          makerAddress: orderInfo.maker.address,
          takerAddress: orderInfo.taker.address,
          senderAddress: NULL_ADDRESS,
          feeRecipientAddress: this.contractWrappers.contractAddresses.exchange,
          expirationTimeSeconds: expirationTimeSeconds,
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

  // ERC721 Token
  public async setApprovalForAll(
      contractAddress: string,
      makerAddress: string,
      tokenId?: string,
      gasPrice?: string
  ): Promise<void> {
      const opts = gasPrice ? { from: makerAddress, gasPrice } : { from: makerAddress }
      const erc721Token = new ERC721TokenContract(
          contractAddress,
          this.providerEngine
      );
      try {
          await erc721Token
              .setApprovalForAll(
                  this.contractWrappers.contractAddresses.erc721Proxy,
                  true
              )
              .awaitTransactionSuccessAsync(opts)
      } catch (e) {
          // CryptoKitties などの場合
          await erc721Token
              .approve(
                  this.contractWrappers.contractAddresses.erc721Proxy,
                  new BigNumber(tokenId || 0)
              )
              .awaitTransactionSuccessAsync(opts);
      }  
  }
  public async isApprovedForAll(
      contractAddress: string,
      makerAddress: string,
      tokenId?: string
  ): Promise<boolean> {
      const erc721Token = new ERC721TokenContract(
          contractAddress,
          this.providerEngine
      );
      try {
          const makerERC721ApprovalTxHash = await erc721Token
              .isApprovedForAll(
                  makerAddress,
                  this.contractWrappers.contractAddresses.erc721Proxy
              ).callAsync({ from: makerAddress })
          return makerERC721ApprovalTxHash;
      } catch (e) {
          // CryptoKitties などの場合
          return false
      }
  }

  // ERC20 Token
  public async approve(
      contractAddress: string,
      makerAddress: string,
      gasPrice?: string
  ): Promise<void> {
      const opts = gasPrice ? { from: makerAddress, gasPrice } : { from: makerAddress }
      const erc20Token = new ERC20TokenContract(
          contractAddress,
          this.providerEngine
      );
      await erc20Token
          .approve(
              this.contractWrappers.contractAddresses.erc20Proxy,
              MAX_ALLOWANCE
          )
          .awaitTransactionSuccessAsync(opts);
  }
  public async allowance(
      contractAddress: string,
      makerAddress: string
  ): Promise<BigNumber> {
      const erc20Token = new ERC20TokenContract(
          contractAddress,
          this.providerEngine
      );
      return await erc20Token
          .allowance(
              makerAddress,
              this.contractWrappers.contractAddresses.erc20Proxy
          ).callAsync({ from: makerAddress })
  }
  public async balanceOf(
      contractAddress: string,
      makerAddress: string
  ): Promise<BigNumber> {
      const erc20Token = new ERC20TokenContract(
          contractAddress,
          this.providerEngine
      );
      return await erc20Token
          .balanceOf(makerAddress)
          .callAsync({ from: makerAddress })
  }

  public async fillOrder(
      signedOrder: SignedOrder,
      taker: string,
      takerAssetAmount: BigNumber,
      gasPrice?: string
  ): Promise<string> {
      const gas = (await this.contractWrappers.exchange
          .fillOrder(signedOrder, takerAssetAmount, signedOrder.signature)
          .estimateGasAsync({
              from: taker,
              gasPrice: gasPrice || TX_DEFAULTS.gasPrice,
              value: this.calculateProtocolFee([signedOrder], Number(gasPrice || TX_DEFAULTS.gasPrice))
          })) * 1.5;
      const opts = {
          gas,
          gasPrice: gasPrice || TX_DEFAULTS.gasPrice
      }
      console.log('gasPrice', gasPrice)
      const txHash = await this.contractWrappers.exchange
          .fillOrder(signedOrder, takerAssetAmount, signedOrder.signature)
          .sendTransactionAsync({
              from: taker,
              ...opts,
              value: this.calculateProtocolFee([signedOrder], Number(gasPrice || TX_DEFAULTS.gasPrice))
          });
      return txHash;
  }

  public async getOrderInfo(
      order: SignedOrder,
      fromAddress: string
  ): Promise<{
      orderStatus: number;
      orderHash: string;
      orderTakerAssetFilledAmount: BigNumber;
  }> {
      const orderInfo = await this.contractWrappers.exchange
          .getOrderInfo(order)
          .callAsync({ from: fromAddress })
      return orderInfo
  }

  calculateProtocolFee(
      orders: SignedOrder[],
      gasPrice: BigNumber | number = TX_DEFAULTS.gasPrice
  ): BigNumber {
      return new BigNumber(150000).times(gasPrice).times(orders.length);
  }
}

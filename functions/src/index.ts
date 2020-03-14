import {
  assetDataUtils,
  Order,
  generatePseudoRandomSalt,
  SignedOrder,
  signatureUtils
} from "@0x/order-utils";
import { BigNumber } from "@0x/utils";
import { ContractWrappers, ERC721TokenContract } from "@0x/contract-wrappers";
import {
  NULL_ADDRESS,
  NULL_BYTES,
  ZERO,
  TEN_MINUTES_MS,
  ONE_SECOND_MS
} from "./constants";
import { calculateProtocolFee } from "./utils";
import { NETWORK_CONFIGS, TX_DEFAULTS } from "./configs";
import { Web3ProviderEngine } from "@0x/migrations";

const randomExpiration = new BigNumber(Date.now() + TEN_MINUTES_MS)
  .div(ONE_SECOND_MS)
  .integerValue(BigNumber.ROUND_CEIL);

const config = {
  chainId: 1337,
  exchangeAddress: NULL_ADDRESS
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

export default class libZeroEx {
  providerEngine: Web3ProviderEngine;
  public contractWrappers: ContractWrappers;
  public constructor(
    providerEngine: Web3ProviderEngine
  ) {
    this.providerEngine = providerEngine;
    this.contractWrappers = new ContractWrappers(providerEngine, {
      chainId: NETWORK_CONFIGS.chainId
    });;
  }
  public createSingleAssetData(token: tokenData): string {
    const makerAssetData = assetDataUtils.encodeERC721AssetData(
      token.contractAddress,
      token.tokenId
    );
    return makerAssetData;
  }

  public createMultiAssetData(tokens: tokenData[]): string {
    const encodedDatas = tokens.map(this.createSingleAssetData);
    const encodedMultiDatas = assetDataUtils.encodeMultiAssetData(
      //is this for erc20??? if erc721 always 1??
      [new BigNumber(1), new BigNumber(1)],
      encodedDatas
    );
    return encodedMultiDatas;
  }

  public createAssetData(tokenDatas: tokenData[]) {
    if (tokenDatas.length > 1) {
      return this.createMultiAssetData(tokenDatas);
    } else {
      return this.createSingleAssetData(tokenDatas[0]);
    }
  }

  public createOrderJson(orderBaseInfo: orderBaseInfo): Order {
    console.log(orderBaseInfo)
    const makerAssetData = this.createAssetData(orderBaseInfo.makerTokenData);
    const takerAssetData = this.createAssetData(orderBaseInfo.takerTokenData);
    const order: Order = {
      chainId: config.chainId,
      exchangeAddress: this.contractWrappers.contractAddresses.exchange,
      makerAddress: orderBaseInfo.makerAddress,
      takerAddress: orderBaseInfo.takerAddress,
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

  public async sign(
    order: Order,
    maker: string
  ): Promise<SignedOrder> {
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
      .setApprovalForAll(this.contractWrappers.contractAddresses.erc721Proxy, true)
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
        value: calculateProtocolFee([signedOrder])
      });
    return txHash;
  }
}

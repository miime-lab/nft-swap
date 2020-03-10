import { assetDataUtils } from "@0x/order-utils";
import {
  createSingleAssetData,
  createMultiAssetData,
  createOrderJson
} from "../index";
import { BigNumber } from "@0x/utils";
import { decode } from "punycode";

const orderBaseInfo = {
  makerAddress: "0xc82f5fcbfaaf7ca1f6d0a969db58a6bba2958840",
  makerTokenData: [
    {
      contractAddress: "0x67cbbb366a51fff9ad869d027e496ba49f5f6d55",
      tokenId: new BigNumber(110800616)
    },

    {
      contractAddress: "0x67cbbb366a51fff9ad869d027e496ba49f5f6d55",
      tokenId: new BigNumber(113300006)
    }
  ],
  takerAddress: "0x340765f804027be55b82a214fd9b7d3107b0ac76",
  takerTokenData: [
    {
      contractAddress: "0xdceaf1652a131f32a821468dc03a92df0edd86ea",
      tokenId: new BigNumber(10141042)
    },
    {
      contractAddress: "0xdceaf1652a131f32a821468dc03a92df0edd86ea",
      tokenId: new BigNumber(10371519)
    }
  ]
};

test("Create Single AssetData.", () => {
  const tokenData = orderBaseInfo.makerTokenData[0];
  const encodedData = createSingleAssetData(tokenData);
  const decodedData = assetDataUtils.decodeERC721AssetData(encodedData);
  console.log("decoded Data:",decodedData)
  console.log("type of decoded Data:", typeof decodedData)
  expect(decodedData.tokenAddress).toBe(tokenData.contractAddress);
  //why decodedData.tokenId is not bignumber??
  expect(decodedData.tokenId.toString()).toBe(tokenData.tokenId.toString());
});

test("Create OrderJson", () => {
  const orderJson = createOrderJson(orderBaseInfo);
  console.log(orderJson)
  expect(orderJson.makerAddress).toBe(orderBaseInfo.makerAddress);
  const decodedAssetsData = assetDataUtils.decodeMultiAssetData(
    orderJson.makerAssetData
  );
  const decodedSingleData = assetDataUtils.decodeERC721AssetData(
    decodedAssetsData.nestedAssetData[0]
  );
  expect(decodedSingleData.tokenAddress).toBe(
    orderBaseInfo.makerTokenData[0].contractAddress
  );
});

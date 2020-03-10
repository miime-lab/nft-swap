import { OpenseaClient } from "../openseaClient";

const openseaClient = new OpenseaClient();

const assetData = {
  contractAddress: "0x67cbbb366a51fff9ad869d027e496ba49f5f6d55",
  tokenId: BigInt(110800616)
};

test("GetAssetDataFromOpenSea", async() => {
  const asset = await openseaClient.getAssetData(assetData);
  expect(asset.name).toBe('Minerva #110800616')
});

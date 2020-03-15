import { OpenseaClient } from "../src/openseaClient";
const testUrl = "https://opensea.io/assets/0xdceaf1652a131f32a821468dc03a92df0edd86ea/30450324"
const openseaClient = new OpenseaClient();

const assetData = {
  contractAddress: "0x67cbbb366a51fff9ad869d027e496ba49f5f6d55",
  tokenId: BigInt(110800616)
};

test("GetAssetDataFromOpenSea", async() => {
  const asset = await openseaClient.getAssetData(assetData);
  expect(asset.name).toBe('Minerva #110800616')
});

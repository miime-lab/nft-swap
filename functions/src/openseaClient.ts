import axios from "axios"
// type assetData = {
//     contractAddress: string,
//     tokenId:bigint
// }

type openseaAsset= {
    contractAddress: string,
    tokenId:string,
    name:string,
    photoUrl:string
}
//not type safe....
export class OpenseaClient {
    getUrl(assetData:any){
        return `https://api.opensea.io/api/v1/asset/${assetData.contractAddress}/${assetData.tokenId}/`
    }
    async getAssetData(assetData:any){
        const url = this.getUrl(assetData)
        try{
            const res = await axios.get(url)
            return {
                contractAddress: assetData.contractAddress.toString(),
                tokenId: BigInt(assetData.tokenId),
                name: res.data.name.toString(),
                photoUrl: res.data.image_url.toString()
            }
        }catch(err){
            console.log(err)
            return {}
        }
    }
}

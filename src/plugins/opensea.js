const request = require('request')

class OpenSea {
  constructor () {
    this.apiBaseUrl = 'https://api.opensea.io/api/v1'
  }

  async doRequest (url) {
    const opts = {
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'request',
        'Content-Type': 'application/json'
        // 'X-API-KEY': ''
      }
    }
    return new Promise((resolve, reject) => {
      request(opts, (error, _res, body) => {
        if (error) {
          reject(error)
        }
        resolve(JSON.parse(body))
      })
    })
  }

  async getAssetInfo (contractAddress, tokenId) {
    const url = this.apiBaseUrl + '/assets' +
      '?asset_contract_address=' + contractAddress.toLowerCase() +
      '&token_ids=' + tokenId
    console.log('url', url)
    const res = await this.doRequest(url)
    const asset = res.assets[0]
    return asset
  }
}

const opensea = new OpenSea()

export default opensea

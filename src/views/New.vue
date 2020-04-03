<template>
  <v-container
    class="fill-height"
  >
    <v-row
      justify="center"
      class="ml-0"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-item-group>
          <v-card
            v-for="asset of sendingAssets"
            :key="asset.id"
            :loading="asset.loading"
            loader-height="5px"
            class="elevation-4 mt-2 mb-0"
          >
            <v-toolbar
              v-if="asset.id === 0"
              color="cyan lighten-2"
              height="38px"
              dark
              flat
            >
              <v-toolbar-title class="subtitle-1">
                {{ $t("message.card_title_sending") }}
              </v-toolbar-title>
            </v-toolbar>

            <v-img
              v-if="!!asset.image"
              class="align-end"
              :src="asset.image"
            />
            <v-card-title
              v-if="!!asset.name"
            >
              {{ asset.name }}
            </v-card-title>
            <v-card-subtitle
              v-if="!!asset.contractName"
            >
              {{ asset.contractName }} #{{ asset.tokenId }}
            </v-card-subtitle>

            <v-card-text
              v-if="!asset.image"
            >
              <v-form>
                <v-text-field
                  ref="asset.url"
                  v-model="asset.url"
                  :label="$t('message.card_input_label_url')"
                  :rules="[loadAssetInfoFromUrl('sendingAssets', asset.id)]"
                  :error-messages="asset.errorMessages"
                  name="url"
                  type="text"
                />
              </v-form>
            </v-card-text>

            <v-fab-transition
              v-if="!!asset.image && asset.id === sendingAssets.length - 1"
            >
              <v-btn
                color="cyan lighten-2"
                dark
                small
                absolute
                bottom
                right
                fab
                @click="addAsset('sendingAssets')"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card>

          <v-card
            class="elevation-4 mt-8 mb-0"
          >
            <v-toolbar
              color="cyan lighten-2"
              height="38px"
              dark
              flat
            >
              <v-toolbar-title class="subtitle-1">
                {{ $t("message.card_title_sending_weth") }}
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-text-field
                  ref="sendingCurrencies[0].amount"
                  v-model="sendingCurrencies[0].amount"
                  :rules="[isNumber]"
                  suffix="WETH"
                  :error-messages="sendingCurrencies[0].errorMessages"
                  placeholder="0"
                  name="amount"
                  type="text"
                  class="subtitle-1"
                />
              </v-form>
            </v-card-text>
          </v-card>
        </v-item-group>

        <div
          align="center"
          justify="center"
          class="mt-6 mb-5"
        >
          <img
            src="@/assets/swap-allow.png"
            height="48px"
          >
        </div>

        <v-item-group>
          <v-card
            v-for="asset of receivingAssets"
            :key="asset.id"
            :loading="asset.loading"
            loader-height="5px"
            class="elevation-4 mt-2 mb-0"
          >
            <v-toolbar
              v-if="asset.id === 0"
              color="orange lighten-2"
              height="38px"
              dark
              flat
            >
              <v-toolbar-title class="subtitle-1">
                {{ $t("message.card_title_receiving") }}
              </v-toolbar-title>
            </v-toolbar>

            <v-img
              v-if="!!asset.image"
              class="align-end"
              :src="asset.image"
            />
            <v-card-title
              v-if="!!asset.name"
            >
              {{ asset.name }}
            </v-card-title>
            <v-card-subtitle
              v-if="!!asset.contractName"
            >
              {{ asset.contractName }} #{{ asset.tokenId }}
            </v-card-subtitle>

            <v-card-text
              v-if="!asset.image"
            >
              <v-form>
                <v-text-field
                  ref="asset.url"
                  v-model="asset.url"
                  :label="$t('message.card_input_label_url')"
                  :rules="[loadAssetInfoFromUrl('receivingAssets', asset.id)]"
                  :error-messages="asset.errorMessages"
                  name="url"
                  type="text"
                />
              </v-form>
            </v-card-text>

            <v-fab-transition
              v-if="!!asset.image && asset.id === receivingAssets.length - 1"
            >
              <v-btn
                color="cyan lighten-2"
                dark
                small
                absolute
                bottom
                right
                fab
                @click="addAsset('receivingAssets')"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card>

          <v-card
            class="elevation-4 mt-8 mb-0"
          >
            <v-toolbar
              color="orange lighten-2"
              height="38px"
              dark
              flat
            >
              <v-toolbar-title class="subtitle-1">
                {{ $t("message.card_title_receiving_weth") }}
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-text-field
                  ref="receivingCurrencies[0].amount"
                  v-model="receivingCurrencies[0].amount"
                  :rules="[isNumber]"
                  suffix="WETH"
                  :error-messages="receivingCurrencies[0].errorMessages"
                  placeholder="0"
                  name="amount"
                  type="text"
                  class="subtitle-1"
                />
              </v-form>
            </v-card-text>
          </v-card>

          <!-- {{ orderJson }} -->
        </v-item-group>
      </v-col>
    </v-row>

    <v-row
      justify="center"
      class="ml-0"
    >
      <v-dialog
        v-model="dialog"
        persistent
        scrollable
        max-width="500"
      >
        <template
          v-slot:activator="{ on }"
        >
          <v-btn
            color="cyan lighten-2"
            class="ma-8 mr-4 ml-4 white--text subtitle-1"
            dark
            v-on="on"
            @click="createOrder"
          >
            {{ $t("message.button_makeOrder") }}
          </v-btn>
        </template>

        <!-- エラーメッセージ モーダル -->
        <v-card
          v-if="errorMessage"
        >
          <v-card-title
            class="headline"
          >
            {{ $t('message.modal_error_title') }}
          </v-card-title>

          <v-card-text>{{ errorMessage }}</v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- 取引許可 モーダル -->
        <v-card
          v-else-if="waitingApprovalMessage"
        >
          <v-card-title
            class="headline"
          >
            {{ $t('message.modal_approval_title') }}
          </v-card-title>

          <v-card-text>{{ waitingApprovalMessage }}</v-card-text>
        </v-card>

        <!-- 署名待ち モーダル -->
        <v-card
          v-else-if="waitingSigningMessage"
        >
          <v-card-title
            class="headline"
          >
            {{ $t('message.modal_signing_title') }}
          </v-card-title>

          <v-card-text>{{ waitingSigningMessage }}</v-card-text>
        </v-card>

        <!-- 完了 モーダル -->
        <v-card
          v-else-if="completedMessage"
        >
          <v-card-title
            class="headline"
          >
            {{ $t('message.modal_completed_title') }}
          </v-card-title>

          <v-card-text>{{ completedMessage }}</v-card-text>
        </v-card>

        <!-- オーダー作成 モーダル -->
        <v-card
          v-else
        >
          <v-card-title
            class="headline"
          >
            {{ $t("message.modal_makeOrder_title") }}
          </v-card-title>

          <v-card-text>
            <!-- コントラクト -->
            {{ $t('message.modal_makeOrder_headline_contract') }}:
            <a
:href="orderForDisplay.exchangeLink"
               target="_blank"
>
              {{ this.orderForDisplay.exchangeName }}
            </a>
            <br>

            <!-- 有効期限 -->
            {{ $t('message.modal_makeOrder_headline_expiration_date') }}: {{ this.orderForDisplay.expirationDate }}<br>
            <br>

            <!-- 送付側 -->
            <div class="title mb-2">
              {{ $t('message.modal_makeOrder_headline_sending_side') }}
            </div>
            <ul>
              <li>
                {{ $t('message.modal_makeOrder_headline_address') }}:
                <a
:href="orderForDisplay.makerLink"
                   target="_blank"
>
                  {{ this.orderForDisplay.makerAddress }}
                </a>
              </li>
              <li>
{{ $t('message.modal_makeOrder_headline_assets') }}:
                <ul
                  v-if="!!orderForDisplay.makerAssets"
                >
                  <li
                    v-for="asset of orderForDisplay.makerAssets"
                    :key="asset.id"
                  >
                    <span
                      v-if="!(asset.amount > 0)"
                    >
                      <a
                        :href="asset.url"
                        target="_blank"
                      >
                        {{ asset.name }}
                      </a>
                    </span>
                    <span
                      v-else
                    >
                      {{ asset.amount }} {{ asset.symbol }}
                    </span>
                  </li>
                </ul>
              </li><li>{{ $t('message.modal_makeOrder_headline_fee') }}: {{ this.orderForDisplay.makerFee ? this.orderForDisplay.makerFee.toString() : '' }}</li>
            </ul>
            <br>

            <!-- 受取側 -->
            <div class="title mb-2">
              {{ $t('message.modal_makeOrder_headline_receiving_side') }}
            </div>
            <ul>
              <li>
                {{ $t('message.modal_makeOrder_headline_address') }}:
                <a
:href="orderForDisplay.takerLink"
                   target="_blank"
>
                  {{ this.orderForDisplay.takerAddress }}
                </a>
              </li>
              <li>
{{ $t('message.modal_makeOrder_headline_assets') }}:
                <ul>
                  <li
                    v-for="asset of orderForDisplay.takerAssets"
                    :key="asset.id"
                  >
                    <span
                      v-if="!(asset.amount > 0)"
                    >
                      <a
                        :href="asset.url"
                        target="_blank"
                      >
                        {{ asset.name }}
                      </a>
                    </span>
                    <span
                      v-else
                    >
                      {{ asset.amount }} {{ asset.symbol }}
                    </span>
                  </li>
                </ul>
              </li><li>{{ $t('message.modal_makeOrder_headline_fee') }}: {{ this.orderForDisplay.takerFee ? this.orderForDisplay.takerFee.toString() : '' }}</li>
            </ul>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              {{ $t("message.modal_makeOrder_cancel") }}
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="signOrder"
            >
              {{ $t("message.modal_makeOrder_create") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script lang="js">
/* eslint-disable */
import moment from 'moment'
import opensea from '../plugins/opensea'
import { ethers } from 'ethers'
import LibZeroEx from '../plugins/libZeroEx/libZeroEx'
import { assetDataUtils } from '0x.js' // TODO: 最終的には libZeroEx に移す
import firestore from '../plugins/firestore'
import { MetamaskSubprovider, BigNumber } from '0x.js'
// const provider = new Web3ProviderEngine()
// const signer = new MetamaskSubprovider(window.web3.currentProvider)
// provider.addProvider(signer)
// provider.start()

export default {
    name: 'New',
    data: () => ({
        libZeroEx: null,
        sendingAssets: [
            { id: 0, url: '', image: null }
        ],
        sendingCurrencies: [
            { id: 0, contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', amount: '', tokenStandard: 'ERC20' } // WETH
        ],
        receivingAssets: [
            { id: 0, url: '', image: null }
        ],
        receivingCurrencies: [
            { id: 0, contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', amount: '', tokenStandard: 'ERC20' } // WETH
        ],
        isNumber: value => !isNaN(value) || 'Please input a number',
        dialog: false,
        order: {},
        orderForDisplay: {},
        errorMessage: null,
        waitingApprovalMessage: null,
        waitingSigningMessage: null,
        completedMessage: null,
        orderJson:{},
        myAddress:"",
        assets: {
            maker: {
                address: '0x0000000000000000000000000000000000000000',
                tokensERC721: [
                    {
                        contractAddress: '0x0000000000000000000000000000000000000000',
                        tokenId: "40150012"
                    },
                    {
                        contractAddress: '0x0000000000000000000000000000000000000000',
                        tokenId: "30230001"
                    }
                ],
                tokenERC20: undefined
            },
            taker: {
                address: '0x0000000000000000000000000000000000000000',
                tokensERC721: [
                    {
                        contractAddress: '0x0000000000000000000000000000000000000000',
                        tokenId: "30230001"
                    }
                ],
                tokenERC20: undefined
            },
        }
    }),
    created: async function() {
        // this.myAddress = window.web3.currentProvider.selectedAddress
        // await this.setApprovalForAll("0xdceaf1652a131f32a821468dc03a92df0edd86ea", this.myAddress)
        // const sign = await this.createAndSignOrderJson(this.assets)
        // console.log(11111,sign)
        // await firestore.addOrder({test:"test"})
        const getBrowserLanguage = () => {
          try {
            return navigator.browserLanguage || navigator.language || navigator.userLanguage
          } catch(e) {
            return undefined;
          }
        }
        const locale = getBrowserLanguage()
        if (locale) {
            moment.locale(locale)
        }
    },
    methods: {
        loadAssetInfoFromUrl(dataName, id) {
            const asset = this[dataName][id]
            if (!asset.url) {
                return true
            }
            try {
                const [url, contractAddress, tokenId] = asset.url.match(/.*\/(.*)\/(.*)$/)
                console.log(url, contractAddress, tokenId)
                if (this.isAlreadyAddedAsset(dataName, url, id)) {
                    asset.errorMessages = this.$t('message.error_already_input_asset')
                    return false
                }
                asset.errorMessages = ''
                asset.loading = 'cyan lighten-2'
                opensea.getAssetInfo(contractAddress, tokenId).then(assetInfo => {
                    console.log('assetInfo', assetInfo)
                    // sendingAsset.image = asset.image_preview_url
                    asset.image = assetInfo.image_url
                    asset.name = assetInfo.name
                    asset.ownerAddress = assetInfo.owner.address
                    asset.contractName = assetInfo.asset_contract.name
                    asset.contractAddress = assetInfo.asset_contract.address
                    asset.tokenId = assetInfo.token_id
                    asset.tokenStandard = assetInfo.asset_contract.schema_name // 'ERC721' など
                    asset.loading = false
                })
            } catch (e) {
                console.log(e)
                asset.errorMessages = this.$t('message.error_invalid_asset_url')
            }
            return true
        },
        isAlreadyAddedAsset(dataName, url, selfId) {
            if (dataName === 'sendingAssets') {
                return this.sendingAssets.find(asset => asset.url === url && asset.id !== selfId) ||
                    this.receivingAssets.find(asset => asset.url === url)
            } else {
                return this.sendingAssets.find(asset => asset.url === url) ||
                    this.receivingAssets.find(asset => asset.url === url && asset.id !== selfId)
            }
        },
        addAsset(dataName) {
            const newId = this[dataName].length
            this[dataName].push({ id: newId, url: '', image: '' })
        },
        // async setApprovalForAll(tokenAddress, myAddress) {
        //     console.log(tokenAddress)
        //     console.log(await libZeroEx.isApprovedForAll(tokenAddress, myAddress))
        //     if(!await libZeroEx.isApprovedForAll(tokenAddress, myAddress)){
        //         console.log("setapproval")
        //         libZeroEx.setApprovalForAll(tokenAddress, myAddress)
        //     }
        // },
        // async createAndSignOrderJson(orderInfo) {
        //     const orderJson = await libZeroEx.createOrderJson(orderInfo)
        //     console.log(orderJson)
        //     const sign = await libZeroEx.sign(orderJson, this.myAddress)
        //     return sign
        // },
        getAssetFromCache(contractAddress, tokenId) {
            return this.sendingAssets.find(asset => asset.contractAddress === contractAddress && asset.tokenId === tokenId) ||
                this.receivingAssets.find(asset => asset.contractAddress === contractAddress && asset.tokenId === tokenId)
        },
        getAssetsForDisplay(assetData) {
            const assetsForDisplay = []
            const decodedData = assetDataUtils.decodeAssetDataOrThrow(assetData)
            if (assetDataUtils.isERC721TokenAssetData(decodedData)) {
                console.log('isERC721TokenAssetData', decodedData)
                const asset = this.getAssetFromCache(
                    decodedData.tokenAddress,
                    decodedData.tokenId.toString()
                )
                assetsForDisplay.push(asset)
            } else if (assetDataUtils.isMultiAssetData(decodedData)) {
                const multiAssetData = assetDataUtils.decodeMultiAssetDataRecursively(assetData)
                console.log('isMultiAssetData', multiAssetData)
                for (let i = 0; i < multiAssetData.nestedAssetData.length; i++) {
                    const assetData = multiAssetData.nestedAssetData[i]
                    if (assetDataUtils.isERC721TokenAssetData(assetData)) {
                        const asset = this.getAssetFromCache(
                            assetData.tokenAddress,
                            assetData.tokenId.toString()
                        )
                        assetsForDisplay.push(asset)
                    } else if (assetDataUtils.isERC20TokenAssetData(assetData)) {
                        if (assetData.tokenAddress !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') { // WETH
                            throw new Error('Not supported ERC20 token:', assetData)
                        }
                        assetsForDisplay.push({
                            symbol: 'WETH',
                            amount: ethers.utils.formatEther(multiAssetData.amounts[i].toString())
                        })
                    } else {
                        throw new Error('Not supported asset:', assetData)
                    }
                }
            } else {
                console.log('not isERC721TokenAssetData')
            }
            return assetsForDisplay
        },
        translateOrder(order) {
            const orderForDisplay = { ...order }

            orderForDisplay.exchangeLink = 'https://etherscan.io/address/' + order.exchangeAddress
            orderForDisplay.exchangeName =
                order.exchangeAddress === '0x61935cbdd02287b511119ddb11aeb42f1593b7ef'
                    ? '0x Protocol Exchange v3' : order.exchangeAddress

            orderForDisplay.expirationDate = moment.unix(order.expirationTimeSeconds.toString()).format()

            orderForDisplay.makerLink = 'https://etherscan.io/address/' + order.makerAddress
            orderForDisplay.takerLink = 'https://etherscan.io/address/' + order.takerAddress

            orderForDisplay.makerAssets = this.getAssetsForDisplay(order.makerAssetData)
            orderForDisplay.takerAssets = this.getAssetsForDisplay(order.takerAssetData)

            return orderForDisplay
        },
        makeOneSideInfo(assetTokens, currencyToken) {
            if (!assetTokens[0].ownerAddress) {
                console.log('Please input at least one asset')
            }

            const result = {
                address: assetTokens[0].ownerAddress,
                tokensERC721: []
            }
            for (const assetToken of assetTokens) {
                if (!assetToken.contractAddress) {
                    continue
                }
                result.tokensERC721.push({
                    contractAddress: assetToken.contractAddress,
                    tokenId: new BigNumber(assetToken.tokenId)
                })
            }
            if (currencyToken.amount > 0) {
                const wei = ethers.utils.parseEther(currencyToken.amount).toString()
                result.tokenERC20 = {
                    contractAddress: currencyToken.contractAddress,
                    amount: new BigNumber(wei)
                }
            }
            console.log('result', result)
            return result
        },
        existAssetInputs() {
          return this.sendingAssets[0].tokenId && this.receivingAssets[0].tokenId
        },
        async createOrder() {
            try {
                this.errorMessage = null

                await window.ethereum.enable()
                const provider = new MetamaskSubprovider(window.ethereum)
                this.libZeroEx = new LibZeroEx(provider)

                if (!this.existAssetInputs()) {
                    this.errorMessage = this.$t('message.modal_error_no_asset')
                    return
                }

                const orderInfo = {
                    maker: this.makeOneSideInfo(this.sendingAssets, this.sendingCurrencies[0]),
                    taker: this.makeOneSideInfo(this.receivingAssets, this.receivingCurrencies[0])
                }
                this.order = await this.libZeroEx.createOrderJson(orderInfo)
                this.orderForDisplay = this.translateOrder(this.order)
                console.log('orderForDisplay:', this.orderForDisplay)
            } catch (e) {
                this.errorMessage = e.message
            }
        },
        async signOrder() {
            try {
                console.log('signOrder')
                this.errorMessage = null

                const contractAddressCache = {}
                for (const asset of this.orderForDisplay.makerAssets) {
                    if (asset.tokenStandard === 'ERC721') {
                        const isApproved = await this.libZeroEx.isApprovedForAll(asset.contractAddress, asset.ownerAddress)
                        if (!isApproved) {
                            this.waitingApprovalMessage = this.$t('message.modal_makeOrder_message')
                            await this.libZeroEx.setApprovalForAll(asset.contractAddress, asset.ownerAddress, asset.tokenId)
                        }
                    } else if (asset.tokenStandard === 'ERC20') {
                        const allowance = await this.libZeroEx.allowance(asset.contractAddress, asset.ownerAddress)
                        const amount = new BigNumber(ethers.utils.formatEther(multiAssetData.amounts[i].toString()))
                        if (allowance.lt(amount)) {
                            this.waitingApprovalMessage = this.$t('message.modal_makeOrder_message')
                            await this.libZeroEx.approve(asset.contractAddress, asset.ownerAddress)
                        }
                    }
                }
                this.waitingSigningMessage = this.$t('message.modal_waiting_signing_message')
                this.waitingApprovalMessage = null

                const signedOrder = await this.libZeroEx.sign(this.order, this.order.makerAddress)
                // TODO: normalize

                // const docId = await firestore.addOrder({ order: signedOrder, createdDate: new Date() })
                console.log('docId', docId)

                this.completedMessage = this.$t('message.modal_completed_message')
                this.waitingSigningMessage = null

            } catch (e) {
                this.errorMessage = e.message
            }
        }
    },
}
</script>
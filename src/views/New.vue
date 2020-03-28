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
              <v-toolbar-title class="subtitle-1">{{ $t("message.card_title_sending") }}</v-toolbar-title>
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
              <v-toolbar-title class="subtitle-1">{{ $t("message.card_title_sending_weth") }}</v-toolbar-title>
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
              <v-toolbar-title class="subtitle-1">{{ $t("message.card_title_receiving") }}</v-toolbar-title>
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
              <v-toolbar-title class="subtitle-1">{{ $t("message.card_title_receiving_weth") }}</v-toolbar-title>
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

        <v-card
          v-if="!!orderForDisplay"
        >
          <v-card-title
            class="headline"
          >
            {{ $t("message.modal_makeOrder_title") }}
          </v-card-title>

          <v-card-text>

            <div class="title mb-2">全体</div>
            <ul>
              <li>コントラクト:
                  <a :href="orderForDisplay.exchangeLink" target="_blank">
                      {{ this.orderForDisplay.exchangeName }}
                  </a>
              </li>
              <li>有効期限: {{ this.orderForDisplay.expirationDate }}</li>
            </ul>
            <br>

            <div class="title mb-2">送付側</div>
            <ul>
              <li>アドレス:
                  <a :href="orderForDisplay.makerLink" target="_blank">
                      {{ this.orderForDisplay.makerAddress }}
                  </a>
              </li>
              <li>アセット
                <ul>
                  <!-- <li
                    v-for="asset of orderForDisplay.makerAssets"
                    :key="asset.id"
                  >
                  </li> -->
                  <li>MyCryptoHeroes:Extension #20600077</li>
                  <li>MyCryptoHeroes:Extension #20600111</li>
                  <li>0.1 WETH</li>
                </ul>
              <li>支払い手数料: {{ this.orderForDisplay.makerFee.toString() }}</li>
            </ul>
            <br>

            <div class="title mb-2">受取側</div>
            <ul>
              <li>アドレス:
                  <a :href="orderForDisplay.takerLink" target="_blank">
                      {{ this.orderForDisplay.takerAddress }}
                  </a>
              </li>
              <li>アセット
                <ul>
                  <li>MyCryptoHeroes:Extension #20600111</li>
                </ul>
              <li>支払い手数料: {{ this.orderForDisplay.takerFee.toString() }}</li>
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
import LibZeroEx from '../plugins/libZeroEx/libZeroEx'
import { assetDataUtils } from '0x.js' // TODO: 最終的には libZeroEx に移す
import {MetamaskSubprovider, Web3ProviderEngine, BigNumber} from '0x.js'
const provider = new Web3ProviderEngine()
const signer = new MetamaskSubprovider(window.web3.currentProvider)
provider.addProvider(signer)
provider.start()
const libZeroEx = new LibZeroEx(window.web3.currentProvider)
export default {
    name: 'New',
    data: () => ({
        sendingAssets: [
            { id: 0, url: '', image: null }
        ],
        sendingCurrencies: [
            { id: 0, contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', amount: '' } // WETH
        ],
        receivingAssets: [
            { id: 0, url: '', image: null }
        ],
        receivingCurrencies: [
            { id: 0, contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', amount: '' } // WETH
        ],
        isNumber: value => !isNaN(value) || 'Please input a number',
        dialog: false,
        order: {},
        orderForDisplay: null,
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
        loadAssetInfoFromUrl (dataName, id) {
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
                    asset.loading = false
                })
            } catch (e) {
                console.log(e)
                asset.errorMessages = this.$t('message.error_invalid_asset_url')
            }
            return true
        },
        isAlreadyAddedAsset (dataName, url, selfId) {
            if (dataName === 'sendingAssets') {
                return this.sendingAssets.find(asset => asset.url === url && asset.id !== selfId) ||
                    this.receivingAssets.find(asset => asset.url === url)
            } else {
                return this.sendingAssets.find(asset => asset.url === url) ||
                    this.receivingAssets.find(asset => asset.url === url && asset.id !== selfId)
            }
        },
        addAsset (dataName) {
            const newId = this[dataName].length
            this[dataName].push({ id: newId, url: '', image: '' })
        },
        async setApprovalForAll (tokenAddress, myAddress) {
            console.log(tokenAddress)
            console.log(await libZeroEx.isApprovedForAll(tokenAddress, myAddress))
            if(!await libZeroEx.isApprovedForAll(tokenAddress, myAddress)){
                console.log("setapproval")
                libZeroEx.setApprovalForAll(tokenAddress, myAddress)
            }
        },
        async createAndSignOrderJson(orderInfo) {
            const orderJson = await libZeroEx.createOrderJson(orderInfo)
            console.log(orderJson)
            const sign = await libZeroEx.sign(orderJson, this.myAddress)
            return sign
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
                result.tokenERC20 = {
                    contractAddress: currencyToken.contractAddress,
                    amount: new BigNumber(currencyToken.amount)
                }
            }
            return result
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

            orderForDisplay.makerAssets = {}
            const decodedMakerAssetData = assetDataUtils.decodeAssetDataOrThrow(order.makerAssetData)
            if (assetDataUtils.isERC721TokenAssetData(decodedMakerAssetData)) {
              // 途中
            }

            return orderForDisplay
        },
        async createOrder() {
            const orderInfo = {
                maker: this.makeOneSideInfo(this.sendingAssets, this.sendingCurrencies[0]),
                taker: this.makeOneSideInfo(this.receivingAssets, this.receivingCurrencies[0])
            }
            this.order = await libZeroEx.createOrderJson(orderInfo)
            this.orderForDisplay = this.translateOrder(this.order)
            console.log('order:', this.order)
            console.log('orderForDisplay:', this.orderForDisplay)
        },
        async signOrder() {
            console.log('signOrder')
            this.dialog = false
        }
    },
}
</script>
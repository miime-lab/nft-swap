<template>
  <v-container class="mt-7">
    <v-row
      justify="center"
      class="ml-2 mr-2"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <v-item-group>
          <v-card
            v-for="asset of sendingAssets"
            :key="asset.id"
            :loading="asset.loading"
            loader-height="5px"
            outlined
            class="elevation-4 mb-0 pa-0 justify-center"
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

            <v-row
              v-if="!!asset.name"
              justify="center"
              class="ml-1"
            >
              <v-col
                cols="6"
                sm="7"
                md="7"
              >
                <v-card-title
                  v-if="!!asset.name"
                  class="subtitle-1 ma-0 pa-0"
                >
                  {{ asset.name }}
                </v-card-title>
                <v-card-subtitle
                  v-if="!!asset.contractName"
                  class="caption ma-0 pa-0"
                >
                  {{ asset.contractName }} #{{ asset.tokenId }}
                </v-card-subtitle>
              </v-col>
              <v-col
                cols="4"
                sm="3"
                md="3"
                align="center"
              >
                <v-img
                  v-if="!!asset.image"
                  class="align-center justify-center pa-0 ma-0"
                  :src="asset.image"
                  height="100%"
                  max-width="100px"
                />
              </v-col>
              <v-col
                cols="2"
                sm="2"
                md="2"
                class="d-flex justify-center align-center pr-5"
              >
                <v-icon @click="removeSendingAsset(asset)">
                  mdi-close
                </v-icon>
              </v-col>
            </v-row>

            <v-text-field
              v-if="!asset.image"
              ref="asset.url"
              v-model="asset.url"
              :label="$t('message.card_input_label_url')"
              :rules="[loadAssetInfoFromUrl('sendingAssets', asset.id,'maker')]"
              :error-messages="asset.errorMessages"
              name="url"
              type="text"
              class="mx-5"
            />

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
              <v-toolbar-title class="subtitle-1 ma-0 pa-0">
                {{ $t("message.card_title_sending_weth") }}
              </v-toolbar-title>
            </v-toolbar>

            <v-text-field
              ref="sendingCurrencies[0].amount"
              v-model="sendingCurrencies[0].amount"
              :rules="[isNumber]"
              suffix="WETH"
              :error-messages="sendingCurrencies[0].errorMessages"
              placeholder="0"
              name="amount"
              type="text"
              class="subtitle-1 mx-5"
            />
          </v-card>
        </v-item-group>

        <div
          align="center"
          justify="center"
          class="mt-3 mb-3"
        >
          <v-icon size="50">
            mdi-swap-vertical-bold
          </v-icon>
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

            <v-row
              v-if="!!asset.name"
              justify="center"
              class="ml-1"
            >
              <v-col
                cols="6"
                sm="7"
                md="7"
              >
                <v-card-title
                  v-if="!!asset.name"
                  class="subtitle-1 ma-0 pa-0"
                >
                  {{ asset.name }}
                </v-card-title>
                <v-card-subtitle
                  v-if="!!asset.contractName"
                  class="caption ma-0 pa-0"
                >
                  {{ asset.contractName }} #{{ asset.tokenId }}
                </v-card-subtitle>
              </v-col>
              <v-col
                cols="4"
                sm="3"
                md="3"
                align="center"
              >
                <v-img
                  v-if="!!asset.image"
                  class="align-center justify-center pa-0 ma-0"
                  :src="asset.image"
                  height="100%"
                  max-width="100px"
                />
              </v-col>
              <v-col
                cols="2"
                sm="2"
                md="2"
                class="d-flex justify-center align-center pr-5"
              >
                <v-icon @click="removeReceivingAsset(asset)">
                  mdi-close
                </v-icon>
              </v-col>
            </v-row>


            <v-text-field
              v-if="!asset.image"
              ref="asset.url"
              v-model="asset.url"
              class="mx-5"
              :label="$t('message.card_input_label_url')"
              :rules="[loadAssetInfoFromUrl('receivingAssets', asset.id,'taker')]"
              :error-messages="asset.errorMessages"
              name="url"
              type="text"
            />

            <v-fab-transition
              v-if="!!asset.image && asset.id === receivingAssets.length - 1"
            >
              <v-btn
                color="orange lighten-2"
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

            <v-text-field
              ref="receivingCurrencies[0].amount"
              v-model="receivingCurrencies[0].amount"
              :rules="[isNumber]"
              suffix="WETH"
              :error-messages="receivingCurrencies[0].errorMessages"
              placeholder="0"
              name="amount"
              type="text"
              class="subtitle-1 mx-5"
            />
          </v-card>
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

          <v-card-text
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              size="16"
              width="2"
              color="cyan lighten-2"
            />
          </v-card-text>
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

          <v-card-text
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              size="16"
              width="2"
              color="cyan lighten-2"
            />
          </v-card-text>
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

          <v-card-text>
            {{ baseUrl + '/order/' + orderId }}
            <v-btn
              color="grey darken-1"
              text
              small
              @click="copyToClipboard(baseUrl + '/order/' + orderId)"
            >
              <v-icon
                small
                class="ml-1"
              >
                mdi-content-copy
              </v-icon>
            </v-btn>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              text
              @click="moveToOrderPage(orderId)"
            >
              {{ $t("message.modal_completed_move_to_order_page") }}
            </v-btn>

            <!-- <v-btn
              color="green darken-1"
              text
              @click="moveToNewPage"
            >
              {{ $t("message.modal_completed_move_to_new_page") }}
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="moveToTaskPage"
            >
              {{ $t("message.modal_completed_move_to_task_page") }}
            </v-btn> -->
          </v-card-actions>
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
              {{ orderForDisplay.exchangeName }}
            </a>
            <br>

            <!-- 有効期限 -->
            {{ $t('message.modal_makeOrder_headline_expiration_date') }}: {{ orderForDisplay.expirationDate }}<br>
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
                  {{ orderForDisplay.makerAddress }}
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
                      <v-img
                        :src="asset.image"
                        height="100%"
                        max-width="80"
                        class="grey lighten-4 mt-1 mb-1"
                      />
                    </span>
                    <span
                      v-else
                    >
                      {{ asset.amount }} {{ asset.symbol }}
                    </span>
                  </li>
                </ul>
              </li><li>{{ $t('message.modal_makeOrder_headline_fee') }}: {{ orderForDisplay.makerFee ? orderForDisplay.makerFee.toString() : '' }}</li>
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
                  {{ orderForDisplay.takerAddress }}
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
                      <v-img
                        :src="asset.image"
                        height="100%"
                        max-width="80"
                        class="grey lighten-4 mt-1 mb-1"
                      />
                    </span>
                    <span
                      v-else
                    >
                      {{ asset.amount }} {{ asset.symbol }}
                    </span>
                  </li>
                </ul>
              </li><li>{{ $t('message.modal_makeOrder_headline_fee') }}: {{ orderForDisplay.takerFee ? orderForDisplay.takerFee.toString() : '' }}</li>
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

    <v-row
      justify="center"
      class="ml-0"
    >
      <v-btn
        class="mb-8 mr-4 ml-4 grey--text subtitle-1"
        depressed
        @click="moveToNewPage"
      >
        {{ $t("message.button_reset") }}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable */
import opensea from '../plugins/opensea'
import firestore from '../plugins/firestore'
import moment from 'moment'
import Web3 from 'web3'
import { ethers } from 'ethers'
import LibZeroEx from '../plugins/libZeroEx/libZeroEx'
import { assetDataUtils } from '0x.js' // TODO: 最終的には libZeroEx に移す
import { MetamaskSubprovider, BigNumber } from '0x.js'
export default {
    name: 'New',
    data: () => ({
        libZeroEx: null,
        gasPrice: null,
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
        orderId: null,
        errorMessage: null,
        waitingSigningMessage: null,
        waitingApprovalMessage: null,
        completedMessage: null,
        baseUrl: '',
        myAddress:''
    }),
    created: async function() {
        this.baseUrl = window.location.protocol + '//' + window.location.host

        const getBrowserLanguage = () => {
          try {
            return navigator.browserLanguage || navigator.language || navigator.userLanguage
          } catch(e) {
            console.log(e)
            return undefined;
          }
        }
        const locale = getBrowserLanguage()
        if (locale) {
            moment.locale(locale)
        }
        let provider
        if (window.ethereum) {
            await window.ethereum.enable()
            provider = window.ethereum
        } else if (window.web3) {
            provider = window.web3.currentProvider
        }
        const web3 = new Web3(provider)
        this.myAddress = (await web3.eth.getAccounts())[0] || ''
        this.myAddress = this.myAddress.toLowerCase()
        this.gasPrice = await web3.eth.getGasPrice()
        console.log(this.myAddress)

        this.libZeroEx = new LibZeroEx(new MetamaskSubprovider(provider))
    },
    methods: {
        removeSendingAsset(asset) {
            this.sendingAssets = this.sendingAssets.filter(elem =>
                !(elem.id === asset.id && elem.url === asset.url && elem.image === asset.image))
            if (this.sendingAssets.length < 1) {
                this.sendingAssets = [
                    { id: 0, url: '', image: null }
                ]
            }
        },
        removeReceivingAsset(asset) {
            this.receivingAssets = this.receivingAssets.filter(elem =>
                !(elem.id === asset.id && elem.url === asset.url && elem.image === asset.image))
            if (this.receivingAssets.length < 1) {
                this.receivingAssets = [
                    { id: 0, url: '', image: null }
                ]
            }
        },
        async copyToClipboard(text) {
            await navigator.clipboard.writeText(text)
            alert(this.$t('message.modal_completed_clipboard_copy_done'))
        },
        loadAssetInfoFromUrl(dataName, id, side) {
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
                    if (side === "maker" && assetInfo.owner.address !== this.myAddress) {
                        this.dialog = true
                        this.errorMessage = this.$t('message.error_not_my_token')
                        asset.url = ''
                    } else if (this.isSameOwnerAsset(dataName, assetInfo.owner.address)) {
                        this.dialog = true
                        this.errorMessage = this.$t('message.error_same_owner_assets')
                        asset.url = ''
                    } else if (assetInfo.asset_contract.schema_name !== 'ERC721') {
                        this.dialog = true
                        this.errorMessage = this.$t('message.error_unsupported_token_standard')
                        asset.url = ''
                    } else {
                        // sendingAsset.image = asset.image_preview_url
                        asset.image = assetInfo.image_url
                        asset.name = assetInfo.name
                        asset.ownerAddress = assetInfo.owner.address
                        asset.contractName = assetInfo.asset_contract.name
                        asset.contractAddress = assetInfo.asset_contract.address
                        asset.tokenId = assetInfo.token_id
                        asset.tokenStandard = assetInfo.asset_contract.schema_name // 'ERC721' など
                        asset.loading = false
                    }
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
        isSameOwnerAsset(dataName, ownerAddress) {
            if (dataName === 'sendingAssets') {
                return this.receivingAssets.find(asset => asset.ownerAddress === ownerAddress)
            } else {
                return this.sendingAssets.find(asset => asset.ownerAddress === ownerAddress)
            }
        },
        addAsset(dataName) {
            const newId = this[dataName].length
            this[dataName].push({ id: newId, url: '', image: '' })
        },
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
                            amount: ethers.utils.formatEther(multiAssetData.amounts[i].toString()),
                            tokenStandard: "ERC20",
                            contractAddress: assetData.tokenAddress
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
                console.log(this.$t('message.modal_error_no_asset'))
                throw new Error(this.$t('message.modal_error_no_asset'))
            }

            const ownerAddress = assetTokens[0].ownerAddress
            const result = {
                address: ownerAddress,
                tokensERC721: []
            }
            for (const assetToken of assetTokens) {
                if (!assetToken.contractAddress) {
                    continue
                }
                if (ownerAddress !== assetToken.ownerAddress) {
                    console.log(this.$t('message.modal_error_wrong_owner'))
                    throw new Error(this.$t('message.modal_error_wrong_owner'))
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
        resetModal() {
            this.order = {}
            this.orderForDisplay = {}
            this.orderId = null
            this.waitingApprovalMessage = null
            this.waitingSigningMessage = null
            this.completedMessage = null
        },
        async createOrder() {
            try {
                this.errorMessage = null

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
                console.log(e)
                this.resetModal()
                this.errorMessage = e.message
            }
        },
        async signOrder() {
            try {
                console.log('signOrder')
                this.errorMessage = null

                const contractAddressCache = {}
                for (const asset of this.orderForDisplay.makerAssets) {
                    console.log('tokenStandard', asset.tokenStandard)
                    if (asset.tokenStandard === 'ERC721') {
                        const isApproved = await this.libZeroEx.isApprovedForAll(asset.contractAddress, asset.ownerAddress)
                        if (!isApproved) {
                            this.waitingApprovalMessage = this.$t('message.modal_makeOrder_message')
                            await this.libZeroEx.setApprovalForAll(asset.contractAddress, asset.ownerAddress, asset.tokenId, this.gasPrice)
                        }
                    } else if (asset.tokenStandard === 'ERC20') {
                        // 残高チェック
                        const amount = new BigNumber(ethers.utils.parseEther(asset.amount.toString()).toString())
                        const balance = await this.libZeroEx.balanceOf(asset.contractAddress, this.order.makerAddress)
                        console.log('balance', balance.toString())
                        if (balance.lt(amount)) {
                            this.errorMessage = this.$t('message.modal_error_weth_insufficient_balance')
                            return
                        }

                        const allowance = await this.libZeroEx.allowance(asset.contractAddress, this.order.makerAddress)
                        if (allowance.lt(amount)) {
                            this.waitingApprovalMessage = this.$t('message.modal_makeOrder_message')
                            await this.libZeroEx.approve(asset.contractAddress, this.order.makerAddress, this.gasPrice)
                        }
                    }
                }
                this.waitingSigningMessage = this.$t('message.modal_waiting_signing_message')
                this.waitingApprovalMessage = null

                const signedOrder = await this.libZeroEx.sign(this.order, this.order.makerAddress)
                console.log('signedOrder', signedOrder)
                const normalizedOrder = this.normalizeOrder(signedOrder)

                const nowDate = new Date().getTime()
                const docId = await firestore.addOrder({
                  order: normalizedOrder,
                  makerAddress: this.order.makerAddress,
                  takerAddress: this.order.takerAddress,
                  makerAssets: this.orderForDisplay.makerAssets,
                  takerAssets: this.orderForDisplay.takerAssets,
                  createdAt: nowDate,
                  updatedAt: nowDate,
                  status: 'FILLABLE',
                  deleted: false
                })
                console.log('docId', docId)

                this.orderId = docId
                this.waitingSigningMessage = null
                this.completedMessage = this.$t('message.modal_completed_message')

            } catch (e) {
                console.log(e)
                this.resetModal()
                if (e.message.includes('Specified signerAddress')) {
                    this.errorMessage = this.$t('message.modal_error_wrong_signer')
                } else {
                    this.errorMessage = e.message
                }
            }
        },
        normalizeOrder(order) {
            const result = { ...order }
            result.expirationTimeSeconds = order.expirationTimeSeconds.toString()
            result.salt = order.salt.toString()
            result.makerAssetAmount = order.makerAssetAmount.toString()
            result.takerAssetAmount = order.takerAssetAmount.toString()
            result.makerFee = order.makerFee.toString()
            result.takerFee = order.takerFee.toString()
            return result
        },
        moveToOrderPage(id) {
            console.log('id', id)
            this.dialog = false
            this.$router.push({ name: 'Order', params: { id }})
        },
        moveToNewPage() {
            this.dialog = false
            this.$router.go({ path: this.$router.currentRoute.path, force: true })
        },
        moveToTaskPage() {
            this.dialog = false
            this.$router.push({ path: '/task' })
        }
    },
}
</script>
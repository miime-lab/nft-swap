<template>
  <v-container
    class="fill-height"
  >
    <v-row
      align="start"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >

        <v-dialog
          v-model="dialog"
          persistent
          scrollable
          max-width="500"
        >
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

          <!-- Tx 送信待ち モーダル -->
          <v-card
            v-else-if="waitingSendMessage"
          >
            <v-card-title
              class="headline"
            >
              {{ $t('message.order_page.modal_sending_title') }}
            </v-card-title>

            <v-card-text>{{ waitingSendMessage }}</v-card-text>
          </v-card>
        </v-dialog>

        <!-- オーダー詳細 -->
        <v-card
          v-if="!!order.makerAddress"
          class="elevation-20 mb-0"
        >

          <!-- <v-toolbar
            color="cyan lighten-2"
            height="40px"
            dark
            flat
          >
            <v-toolbar-title class="headline">
              {{ $t("message.order_page.card_title_orderDetail") }}
            </v-toolbar-title>
          </v-toolbar> -->
          <v-card-title
            class="headline"
            color="cyan lighten-2"
            dark
            flat
          >
            {{ $t("message.order_page.card_title_orderDetail") }}
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

            <!-- Maker 側 -->
            <div class="title mb-2">
              {{ isMaker ? $t('message.order_page.headline_sending_side') : isTaker ? $t('message.order_page.headline_receiving_side') : $t('message.order_page.headline_maker_side') }}
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
                        height="80"
                        max-width="80"
                        class="grey lighten-4 mt-1 mb-1"
                      ></v-img>
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

            <!-- Taker 側 -->
            <div class="title mb-2">
              {{ isMaker ? $t('message.order_page.headline_receiving_side') : isTaker ? $t('message.order_page.headline_sending_side') : $t('message.order_page.headline_taker_side') }}
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
                        height="80"
                        max-width="80"
                        class="grey lighten-4 mt-1 mb-1"
                      ></v-img>
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
              :disabled="!isTaker"
              color="green darken-1"
              text
              @click="fillOrder"
            >
              {{ $t("message.button_fillOrder") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable */
import firestore from '../plugins/firestore'
import moment from 'moment'
import Web3 from 'web3'
import { ethers } from 'ethers'
import LibZeroEx from '../plugins/libZeroEx/libZeroEx'
import { assetDataUtils } from '0x.js' // TODO: 最終的には libZeroEx に移す
import { MetamaskSubprovider, BigNumber } from '0x.js'

export default {
    name: 'Order',
    data: () => ({
        libZeroEx: null,
        errorMessage: '',
        order: {},
        orderForDisplay: {},
        makerAssets: [],
        takerAssets: [],
        isMaker: false,
        isTaker: false,
        dialog: false,
        waitingApprovalMessage: null,
        waitingSendMessage: null,
        completedMessage: null
    }),
    created: async function() {
        const orderId = this.$route.params.id
        const orderData = await firestore.getOrder(orderId)
        this.makerAssets = orderData.makerAssets
        this.takerAssets = orderData.takerAssets
        this.order = orderData.order
        this.orderForDisplay = this.translateOrder(this.order)
        console.log('order', this.order)

        if (window.ethereum) {
          await window.ethereum.enable()
          // const provider = new MetamaskSubprovider(window.ethereum)
          const web3 = new Web3(window.ethereum)
          this.myAddress = (await web3.eth.getAccounts())[0] || ''
          console.log('myAddress', this.myAddress)
          this.isMaker = this.myAddress.toLowerCase() === this.order.makerAddress
          this.isTaker = this.myAddress.toLowerCase() === this.order.takerAddress
        } else if (window.web3) {
          const web3 = new Web3(window.web3.currentProvider)
          this.myAddress = (await window.web3.eth.getAccounts())[0] || ''
          this.isMaker = this.myAddress.toLowerCase() === this.order.makerAddress
          this.isTaker = this.myAddress.toLowerCase() === this.order.takerAddress
        }
    },
    methods: {
        getAssetFromCache(contractAddress, tokenId) {
            return this.makerAssets.find(asset => asset.contractAddress === contractAddress && asset.tokenId === tokenId) ||
                this.takerAssets.find(asset => asset.contractAddress === contractAddress && asset.tokenId === tokenId)
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
        async fillOrder () {
            try {
                console.log('fillOrder')
                this.errorMessage = null
                this.dialog = true

                if (!this.libZeroEx) {
                    if (window.ethereum) {
                      await window.ethereum.enable()
                      const provider = new MetamaskSubprovider(window.ethereum)
                      this.libZeroEx = new LibZeroEx(provider)
                    } else {
                      const provider = new MetamaskSubprovider(window.web3.currentProvider)
                      this.libZeroEx = new LibZeroEx(provider)
                    }
                }

                const contractAddressCache = {}
                for (const asset of this.orderForDisplay.takerAssets) {
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
                this.waitingSendMessage = this.$t('message.order_page.modal_waiting_send_tx')
                this.waitingApprovalMessage = null


                const orderForFill = this.convertOrder(this.order)
                const txHash = await this.libZeroEx.fillOrder(orderForFill, orderForFill.takerAddress, orderForFill.takerAssetAmount)
                this.waitingApprovalMessage = null

                this.completedMessage = this.$t('message.order_page.modal_completed_message')

            } catch (e) {
                console.log(e)
                this.resetMordal()
                this.errorMessage = e.message
            }
        },
        convertOrder(normalizedOrder) {
            return {
                chainId: normalizedOrder.chainId,
                exchangeAddress: normalizedOrder.exchangeAddress,
                makerAddress: normalizedOrder.makerAddress,
                takerAddress: normalizedOrder.takerAddress,
                feeRecipientAddress: normalizedOrder.feeRecipientAddress,
                senderAddress: normalizedOrder.senderAddress,
                makerAssetAmount: new BigNumber(normalizedOrder.makerAssetAmount),
                takerAssetAmount: new BigNumber(normalizedOrder.takerAssetAmount),
                makerFee: new BigNumber(normalizedOrder.makerFee),
                takerFee: new BigNumber(normalizedOrder.takerFee),
                expirationTimeSeconds: new BigNumber(normalizedOrder.expirationTimeSeconds),
                salt: new BigNumber(normalizedOrder.salt),
                makerAssetData: normalizedOrder.makerAssetData,
                takerAssetData: normalizedOrder.takerAssetData,
                makerFeeAssetData: normalizedOrder.makerFeeAssetData,
                takerFeeAssetData: normalizedOrder.takerFeeAssetData,
                signature: normalizedOrder.signature
            }
        },
        resetMordal() {
            this.waitingApprovalMessage = null
            this.waitingSigningMessage = null
            this.completedMessage = null
        },
    }
}
</script>

<template>
  <v-container class="mt-7">
    <v-row
      align="start"
      justify="center"
      class="ml-2 mr-2 mt-0 mb-0"
    >
      <v-col
        cols="12"
        sm="10"
        md="8"
        class="pa-0"
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

            <v-card-text align="center" justify="center">
              <v-progress-circular
                indeterminate
                size="16"
                width="2"
                color="cyan lighten-2"
              />
            </v-card-text>
          </v-card>

          <!-- Tx 完了待ち モーダル -->
          <v-card
            v-else-if="waitingSendMessage"
          >
            <v-card-title
              class="headline"
            >
              {{ $t('message.order_page.modal_sending_title') }}
            </v-card-title>

            <v-card-text>{{ waitingSendMessage }}</v-card-text>

            <v-card-text align="center" justify="center">
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
              {{ $t('message.order_page.modal_completed_title') }}
            </v-card-title>

            <v-card-text>{{ completedMessage }}</v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                @click="fillOrderCompleted"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- オーダー詳細 -->
        <v-card
          v-if="!!order.makerAddress"
          class="elevation-4 pl-2"
        >
          <v-row
            class="align-center justify-space-between ml-0"
          >
            <v-col
              class="pa-0"
            >
              <v-card-title
                color="cyan lighten-2 ml-8 pb-0"
                dark
                flat
              >
                {{ $t("message.order_page.card_title_orderDetail") }}
              </v-card-title>
            </v-col>
            <v-col>
              <v-btn
                color="grey darken-1"
                text
                small
                @click="copyUrl"
              >
                {{ $t('message.order_page.button_url_copy_title') }}
                <v-icon
                  small
                  class="ml-1"
                >
                  mdi-content-copy
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-card-text>
            <!-- ID -->
            <p>ID: {{ orderId }}</p>

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

            <!-- ステータス -->
            {{ $t('message.order_page.headline_order_status') }}: {{ getStatusLabel(orderForDisplay.status) }}<br>
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
                        height="100%"
                        max-width="80"
                        class="grey lighten-4 mt-1 mb-1"
                      />
                    </span>
                    <span
                      v-else
                    >
                      {{ asset.amount }} {{ asset.symbol }}
                      <span
                        v-if="isMaker"
                        class="blue--text"
                      >
                        ({{ $t('message.headline_balance') }}: {{ roundEth(wethBalance) }} WETH, {{ roundEth(ethBalance) }} ETH)
                      </span>
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
                        height="100%"
                        max-width="80"
                        class="grey lighten-4 mt-1 mb-1"
                      />
                    </span>
                    <span
                      v-else
                    >
                      {{ asset.amount }} {{ asset.symbol }}
                      <span
                        v-if="isTaker"
                        class="blue--text"
                      >
                        ({{ $t('message.headline_balance') }}: {{ roundEth(wethBalance) }} WETH, {{ roundEth(ethBalance) }} ETH)
                      </span>
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
        errorMessage: '',
        libZeroEx: null,
        myAddress: null,
        ethBalance: null,
        wethBalance: null,
        gasPrice: null,
        orderId: '',
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

        this.orderId = this.$route.params.id
        const orderData = await firestore.getOrder(this.orderId)
        this.makerAssets = orderData.makerAssets
        this.takerAssets = orderData.takerAssets
        this.order = orderData.order
        this.orderForDisplay = this.translateOrder(this.order)
        this.orderForDisplay.status = orderData.status
        console.log('order', this.order)

        if (!window.ethereum && !window.web3) {
          return
        }

        if (window.ethereum) {
            await window.ethereum.enable()
            this.provider = window.ethereum
        } else if (window.web3) {
            this.provider = window.web3.currentProvider
        }
        const web3 = new Web3(this.provider)
        this.myAddress = (await web3.eth.getAccounts())[0] || ''
        console.log('myAddress', this.myAddress)
        this.isMaker = this.myAddress.toLowerCase() === this.order.makerAddress
        this.isTaker = this.myAddress.toLowerCase() === this.order.takerAddress

        this.libZeroEx = new LibZeroEx(new MetamaskSubprovider(this.provider))

        this.gasPrice = await web3.eth.getGasPrice()
        console.log('gasPrice', this.gasPrice)
        this.ethBalance = ethers.utils.formatEther((await web3.eth.getBalance(this.myAddress)).toString())
        console.log('ethBalance', this.ethBalance)
        this.wethBalance = await this.getWethBalance(this.myAddress)
        console.log('wethBalance', this.wethBalance)

        await this.checkAndUpdateOrderStatus()
    },
    methods: {
        async copyUrl() {
            await navigator.clipboard.writeText(location.href)
            alert(this.$t('message.order_page.url_copy_done'))
        },
        roundEth(ethValue) {
          if (!ethValue) {
            return ''
          }
          const [ integerPart, decimalPart ] = ethValue.split('.')
          if (!decimalPart) {
            return ethValue
          }
          return integerPart + '.' + decimalPart.substr(0, 4)
        },
        async getWethBalance(address) {
            const wethContractAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
            const balance = await this.libZeroEx.balanceOf(wethContractAddress, address)
            return ethers.utils.formatEther(balance.toString())
        },
        async checkAndUpdateOrderStatus() {
            const orderInfo = await this.libZeroEx.getOrderInfo(this.order)
            console.log('orderInfo', orderInfo)
            const orderStatusLabels = {
              0: 'INVALID',                     // Default value
              1: 'INVALID_MAKER_ASSET_AMOUNT',  // Order does not have a valid maker asset amount
              2: 'INVALID_TAKER_ASSET_AMOUNT',  // Order does not have a valid taker asset amount
              3: 'FILLABLE',                    // Order is fillable
              4: 'EXPIRED',                     // Order has already expired
              5: 'FULLY_FILLED',                // Order is fully filled
              6: 'CANCELLED'                    // Order has been cancelled
            }
            const status = orderStatusLabels[orderInfo.orderStatus]
            if (this.orderForDisplay.status !== status) {
              const updatedAt = new Date().getTime()
              await firestore.updateOrder(this.orderId, { status, updatedAt })
            }
            this.orderForDisplay.status = status
        },
        getStatusLabel(status) {
          if (!status) {
            return '-'
          }
          return this.$t(`message.order_page.order_status.${status}`)
        },
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
        async fillOrder () {
            try {
                console.log('fillOrder')
                this.errorMessage = null
                this.dialog = true
                const contractAddressCache = {}
                for (const asset of this.orderForDisplay.takerAssets) {
                    if (asset.tokenStandard === 'ERC721') {
                        const currentOwner = await this.libZeroEx.ownerOf(asset.contractAddress, BigNumber(asset.tokenId))
                        if (asset.ownerAddress!==currentOwner){
                            this.errorMessage = this.$t('message.modal_error_owner_changed')
                            return
                        }
                        const isApproved = await this.libZeroEx.isApprovedForAll(asset.contractAddress, asset.ownerAddress)
                        if (!isApproved) {
                            this.waitingApprovalMessage = this.$t('message.modal_makeOrder_message')
                            await this.libZeroEx.setApprovalForAll(asset.contractAddress, asset.ownerAddress, asset.tokenId, this.gasPrice)
                        }
                    } else if (asset.tokenStandard === 'ERC20') {
                        // 残高チェック
                        const amount = new BigNumber(ethers.utils.parseEther(asset.amount.toString()).toString())
                        const balance = await this.libZeroEx.balanceOf(asset.contractAddress, this.order.takerAddress)
                        console.log('balance', balance.toString())
                        if (balance.lt(amount)) {
                            this.errorMessage = this.$t('message.modal_error_weth_insufficient_balance')
                            return
                        }

                        const allowance = await this.libZeroEx.allowance(asset.contractAddress, this.order.takerAddress)
                        if (allowance.lt(amount)) {
                            this.waitingApprovalMessage = this.$t('message.modal_makeOrder_message')
                            await this.libZeroEx.approve(asset.contractAddress, this.order.takerAddress, this.gasPrice)
                        }
                    }
                }
                this.waitingSendMessage = this.$t('message.order_page.modal_waiting_send_tx')
                this.waitingApprovalMessage = null

                const orderForFill = this.convertOrder(this.order)
                const txHash = await this.libZeroEx.fillOrder(orderForFill, orderForFill.takerAddress, orderForFill.takerAssetAmount, this.gasPrice)
                this.waitingApprovalMessage = null

                this.completedMessage = this.$t('message.order_page.modal_completed_message')

            } catch (e) {
                console.log(e)
                this.resetModal()
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
        resetModal() {
            this.waitingApprovalMessage = null
            this.waitingSigningMessage = null
            this.completedMessage = null
        },
        async fillOrderCompleted() {
            this.dialog = false
            this.resetModal()
            await this.checkAndUpdateOrderStatus()
        }
    }
}
</script>

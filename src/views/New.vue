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
          >
            {{ $t("message.button_makeOrder") }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title
            class="headline"
          >
            {{ $t("message.modal_makeOrder_title") }}
          </v-card-title>

          <v-card-text>

            <div class="title mb-2">送付アイテム</div>

            <v-card
              class="mx-auto mb-1 cyan lighten-5"
              max-width="450"
              flat
              light
            >
              <v-card-text class="subtitle-1">所有者アドレス
                <span class="body-1 ml-1">0x98d562c7A4781e3e6c0d16F67469b0A3b0CB25C7</span>
              </v-card-text>
            </v-card>

            <v-card
              class="mx-auto mb-1"
              max-width="450"
              outlined
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="title">MCH Extension: #10600301 Lv.54</v-list-item-title>
                  <v-list-item-subtitle>MyCryptoHeroes:Extension #20600077</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar
                  tile
                  size="80"
                  color="grey"
                ></v-list-item-avatar>
              </v-list-item>

              <v-card-actions>
                <v-btn text v-if="false">Button</v-btn>
              </v-card-actions>
            </v-card>

            <v-card
              class="mx-auto mb-1"
              max-width="450"
              outlined
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="title mb-2">0.1 WETH</v-list-item-title>
                </v-list-item-content>

                <v-list-item-avatar
                  tile
                  size="80"
                  color="grey"
                ></v-list-item-avatar>
              </v-list-item>

              <v-card-actions>
                <v-btn text v-if="false">Button</v-btn>
              </v-card-actions>
            </v-card>

            送付者のアドレス: 0x98d562c7A4781e3e6c0d16F67469b0A3b0CB25C7<br>
            送付アイテム:<br>
            <ul>
              <li>MyCryptoHeroes:Extension #20600077</li>
              <li>MyCryptoHeroes:Extension #20600111</li>
            </ul>
            
            <v-spacer />
            {{ $t("message.modal_makeOrder_message") }}
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
              @click="dialog = false"
            >
              {{ $t("message.modal_makeOrder_approve") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import opensea from '../plugins/opensea'
import LibZeroEx from '../plugins/libZeroEx/libZeroEx'
import { providerEngine } from "../plugins/libZeroEx/provider_engine";
export default {
    name: 'New',
    data: () => ({
        sendingAssets: [
            { id: 0, url: '', image: null }
        ],
        sendingCurrencies: [
            { id: 0, constractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', amount: '' } // WETH
        ],
        receivingAssets: [
            { id: 0, url: '', image: null }
        ],
        receivingCurrencies: [
            { id: 0, constractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', amount: '' } // WETH
        ],
        isNumber: value => !isNaN(value) || 'Please input a number',
        dialog: false,
        orderJson:{},
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
    created: async function (){
        const libZeroEx = new LibZeroEx(providerEngine)
        this.orderJson = await libZeroEx.createOrderJson(this.assets)
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
                    asset.errorMessages = 'The asset is already input.'
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
                asset.errorMessages = !this.sendUrl ? 'Please input OpenSea or miime URL' : 'Invalid url'
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
        }
    },
}
</script>

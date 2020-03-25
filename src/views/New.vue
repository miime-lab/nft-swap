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
        <v-item-group>
          <v-card
            v-for="asset of sendingAssets"
            :key="asset.id"
            :loading="asset.loading"
            loader-height="5px"
            class="elevation-20 mb-0"
          >
            <v-toolbar
              v-if="asset.id === 0"
              color="cyan lighten-2"
              height="38px"
              dark
              flat
            >
              <v-toolbar-title>{{ $t("message.card_title_sending") }}</v-toolbar-title>
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
        </v-item-group>

        <div
          align="center"
          justify="center"
          class="mt-4 mb-3"
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
            class="elevation-20 mb-0"
          >
            <v-toolbar
              v-if="asset.id === 0"
              color="orange lighten-2"
              height="38px"
              dark
              flat
            >
              <v-toolbar-title>{{ $t("message.card_title_receiving") }}</v-toolbar-title>
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
            <!-- <v-divider v-if="!!asset.image" /> -->

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
          {{ orderJson }}
        </v-item-group>
      </v-col>
    </v-row>

    <v-row
      justify="center"
    >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <template
          v-slot:activator="{ on }"
        >
          <v-btn
            color="cyan lighten-2"
            class="ma-8 white--text"
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

<script lang="js">
import opensea from '../plugins/opensea'
import LibZeroEx from '../plugins/libZeroEx/libZeroEx'
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
        receivingAssets: [
            { id: 0, url: '', image: null }
        ],
        dialog: false,
        orderJson:{},
        myAddress:"",
        assets: {
            maker: {
                address: '0xc82F5fcbFAaf7CA1f6d0a969dB58A6BbA2958840',
                tokensERC721: [
                    {
                        contractAddress: '0x0000000000000000000000000000000000000000',
                        tokenId: BigNumber("40150012")
                    },
                    {
                        contractAddress: '0x0000000000000000000000000000000000000000',
                        tokenId: BigNumber("40150011")
                    }
                ],
                tokenERC20: undefined
            },
            taker: {
                address: '0x0000000000000000000000000000000000000000',
                tokensERC721: [
                    {
                        contractAddress: '0x0000000000000000000000000000000000000000',
                        tokenId: BigNumber("40150082")
                    }
                ],
                tokenERC20: undefined
            },
        }
    }),
    created: async function() {
        this.myAddress = window.web3.currentProvider.selectedAddress
        await this.setApprovalForAll("0xdceaf1652a131f32a821468dc03a92df0edd86ea", this.myAddress)
        const sign = await this.createAndSignOrderJson(this.assets)
        console.log(11111,sign)
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
        }
    },
}
</script>

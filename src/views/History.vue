<template>
  <v-container class="mt-7">
    <v-row
      align="start"
      justify="center"
      class="ml-2 mr-2"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <v-toolbar-title
          justify="center"
          class="title mb-2 grey--text"
        >
          {{ $t('message.tab_history') }}
        </v-toolbar-title>

        <v-card
          v-if="!orders || orders.length === 0"
          outlined
          class="mb-2 pa-0 justify-center"
        >
          <v-card-title class="subtitle-1">
            {{ $t('message.headline_no_history') }}
          </v-card-title>
        </v-card>
        <OrderCard
          v-for="order of orders"
          v-else
          :key="order.id"
          :order="order"
        />
      </v-col>

      <v-col
        cols="12"
        align="center"
        class="pa-0"
      >
        <v-btn
          v-if="lastDocSnapshot && lastDocSnapshot.docs.length === 50"
          rounded
          class="grey--text text--darken-2"
          @click="loadMore"
        >
          {{ $t("message.button_load_more") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firestore from '../plugins/firestore'
import moment from 'moment'
import Web3 from 'web3'
import OrderCard from '../components/OrderCard'
export default {
    name: 'History',
    components:{
        OrderCard,
    },
    data: () => ({
        errorMessages: '',
        myAddress: null,
        orders: [
        ],
        lastDocSnapshot: null
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
        console.log('myAddress', this.myAddress)

        const result = await firestore.getOrderByMakerAddress(this.myAddress, 50, undefined)
        this.orders = result.dataArray
        this.lastDocSnapshot = result.docSnapshot
        console.log(this.orders)
    },
    methods: {
        async loadMore() {
            const result = await firestore.getOrderByMakerAddress(this.myAddress, 50, this.lastDocSnapshot)
            this.orders = this.orders.concat(result.dataArray)
            this.lastDocSnapshot = result.dataArray.length > 0 ? result.docSnapshot : null
        }
    }
}
</script>

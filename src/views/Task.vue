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
          {{ $t('message.tab_task') }}
        </v-toolbar-title>
        <OrderCard
          v-for="order of orders"
          :key="order.id"
          :order="order"
        />
        <v-card
          v-for="order of orders"
          :key="order.id"
          class="elevation-4 mb-2 pa-0 justify-center"
          @click="$router.push(`/order/${order.id}`)"
        >
          <v-card-title class="subtitle-1">
            {{ $t('message.headline_order_id') + ': ' + order.id }}
          </v-card-title>
          <v-card-text>
            {{ $t('message.headline_updated_at') + ': ' + getDateStr(order.updatedAt) }}<br>
            {{ $t('message.headline_status') + ': ' + (order.status ? $t(`message.order_page.order_status.${order.status}`) : '-') }}<br>
          </v-card-text>
        </v-card>
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
    name: 'Task',
    components:{
        OrderCard,
    },
    data: () => ({
        errorMessages: '',
        myAddress: null,
        orders: [
            {}
        ]
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

        this.orders = await firestore.getOrderByTakerAddress(this.myAddress, 50, undefined)
        this.orders = this.orders.dataArray
        console.log(this.orders)
    },
    methods: {
        getDateStr (timesatampInMilliSec) {
            return moment(timesatampInMilliSec).format()
        }
    }
}
</script>

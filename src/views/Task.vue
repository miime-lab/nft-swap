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
            v-for="order of orders"
            :key="order.id"
            class="elevation-20 ma-2 pa-1"
          >
            <v-img
              v-if="!!order.makerAssetImage"
              class="align-end"
              :src="order.makerAssetImage"
            />
            <v-card-title
              v-if="!!order.makerAssetName"
            >
              {{ order.makerAssetName }}
            </v-card-title>
            <v-card-subtitle
              v-if="!!order.makerAssetContractName"
            >
              {{ order.makerAssetContractName }} #{{ order.makerAssetTokenId }}
            </v-card-subtitle>

            <v-card-text>
              {{ order.updatedAt }}
            </v-card-text>
          </v-card>
        </v-item-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firestore from "../plugins/firestore"
export default {
    name: 'Task',
    data: () => ({
        errorMessages: '',
        orders: [
            {}
        ]
    }),
    created: async function(){
        this.orders = await firestore.getOrderByTakerAddress("0x6b3c92aadb19750f3dfaad31974d8b3c7e7a171e", 50, undefined)
        this.orders = this.orders.dataArray
    },
    methods: {
        fillOrder () {
        }
    }
}
</script>

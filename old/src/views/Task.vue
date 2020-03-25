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
            class="elevation-20 mb-0"
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
              Dummy
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-btn
                color="cyan lighten-2"
                text
                @click="fillOrder"
              >
                {{ $t("message.button_fillOrder") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-item-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'Task',
    data: () => ({
        errorMessages: '',
        orders: [
            {}
        ]
    }),
    methods: {
        fillOrder () {
        }
    }
}
</script>

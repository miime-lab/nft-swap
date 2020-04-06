<template>
  <v-card
    outlined
    v-if="!order || !order.id"
    class="mb-2 pa-0 justify-center"
  >
    <v-card-title class="subtitle-1">
      {{ $t('message.headline_no_order') }}
    </v-card-title>
  </v-card>
  <v-card
    v-else
    :key="order.id"
    class="elevation-4 mb-2 pa-0 justify-center"
    @click="$router.push(`/order/${order.id}`)"
  >
    <v-card-title class="subtitle-1">
      {{ $t('message.headline_order_id') + ': ' + order.id }}
    </v-card-title>
    <v-card-text>
      {{ $t('message.headline_updated_at') + ': ' }} {{ order.updatedAt|unixToString }}<br>
      {{ $t('message.headline_status') + ': ' + (order.status ? $t(`message.order_page.order_status.${order.status}`) : '-') }}<br>
    </v-card-text>
  </v-card>
</template>
<script lang="js">
import moment from "moment"
export default {
    name: "OrderCard",
    filters:{
        unixToString: function(timesatampInMilliSec){
            return moment(timesatampInMilliSec).format()
        }
    },
    props:['order']
}
</script>
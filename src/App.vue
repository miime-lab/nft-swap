<template>
  <v-app>
    <v-card
      color="cyan lighten-1"
      dark
    >
      <v-card-title class="text-center justify-center py-6">
        <h2
          class="font-weight-bold display-2"
        >
          {{ $t("message.serviceName") }}
        </h2>
      </v-card-title>
      <v-tabs
        background-color="transparent"
        dark
        grow
      >
        <v-tab to="/" class="subtitle-1 font-weight-medium">
          {{ $t("message.tab_new") }}
        </v-tab>
        <v-tab to="/task" class="subtitle-1 font-weight-medium">
          {{ $t("message.tab_task") }}
        </v-tab>
      </v-tabs>
    </v-card>

    <router-view />

    <v-divider />

    <v-footer
      class="cyan lighten-2 text-center justify-center"
      dark
      padless
    >
      <v-col
        class="white py-2 text-center align-start white--text justify-center"
        cols="12"
      >
        <a
          href="https://opensea.io/"
          target="_brank"
        >
          <img
            src="@/assets/opensea-logo.svg"
            height="28px"
            class="ma-2 ml-0"
          >
        </a>
        <a
          href="https://0x.org/"
          target="_brank"
        >
          <img
            src="@/assets/0x-logo.svg"
            height="24px"
            class="ma-2 mb-3 ml-3"
          >
        </a>
        <a
          href="https://miime.io/"
          target="_brank"
        >
          <img
            src="@/assets/miime-logo.svg"
            height="22px"
            class="ma-2 mb-3"
          >
        </a>
      </v-col>

      <v-divider />

      <v-col
        class="cyan lighten-2 py-0 text-center white--text"
        cols="12"
      >
        © 2020 miime lab
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'App'
})
</script>
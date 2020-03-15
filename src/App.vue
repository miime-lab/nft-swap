<template>
  <v-app>
    <v-card
      color="cyan lighten-1"
      dark
    >
      <v-card-title class="text-center justify-center py-6">
        <h2
          class="font-weight-bold display-3"
        >
          {{ $t("message.serviceName") }}
        </h2>
      </v-card-title>
      <v-tabs
        background-color="transparent"
        dark
        grow
        icons-and-text
      >
        <v-tab to="/">
          {{ $t("message.tab_new") }}
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-tab>
        <v-tab to="/task">
          {{ $t("message.tab_task") }}
          <v-icon>mdi-check-box-outline</v-icon>
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
        class="white py-2 text-center align-start white--text"
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
        © 2020 Metaps Alpha Inc.
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

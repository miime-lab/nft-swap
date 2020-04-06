<template>
  <v-app>
    <v-app-bar
      app
      dense
      dark
      color="cyan lighten-1"
      class="elevation-2"
    >
      <v-icon
        v-if="isOrder"
        class="mr-4"
        @click="goBack()"
      >
        mdi-arrow-left
      </v-icon>
      <v-toolbar-title
        v-if="isNewTaskHistory"
        @click="$router.push('/').catch(err => {})"
      >
        <b>{{ $t("message.serviceName") }}</b>
      </v-toolbar-title>
      <v-toolbar-title
        v-if="isOrder"
      >
        <b>{{ $t("message.tab_order") }}</b>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="isNewTaskHistory"
        icon
        @click="$router.push('/task').catch(err => {})"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>

      <v-menu
        v-if="isNewTaskHistory"
        bottom
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="$router.push('/').catch(err => {})"
          >
            <v-list-item-title>{{ $t('message.tab_new') }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$router.push('/history').catch(err => {})"
          >
            <v-list-item-title>{{ $t('message.tab_history') }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$router.push('/task').catch(err => {})"
          >
            <v-list-item-title>{{ $t('message.tab_task') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <div class="mb-6" />

    <router-view />

    <v-spacer />

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
        class="cyan lighten-2 py-0 text-center white--text caption"
        cols="12"
      >
        © 2020 miime lab
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="js">
import Vue from 'vue'
import Web3 from 'web3'
export default Vue.extend({
    name: 'App',
    computed:{
        isNewTaskHistory: function(){
            return this.$route.name === "New" |
        this.$route.name === "Task" |
        this.$route.name === "History"
        },
        isOrder:function(){
            return this.$route.name=== "Order"
        }
    },
    created:async function (){
    },
    methods:{
        goBack: function() {
            const lastPage = window.localStorage.getItem("from");
            if (lastPage === "null" || lastPage === "Order") {
                this.$router.push({ name: "New" }).catch(() => {});
            } else {
                this.$router.go(-1);
            }
        },
    }
})
</script>

<style>

.routerLink{
    text-decoration: none;
}
</style>
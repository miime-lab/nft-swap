import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.use(VueI18n)
Vue.config.productionTip = false

const messages = {
  en: {
    message: {
      welcome: 'Welcome to Your Vue.js App'
    }
  },
  ja: {
    message: {
      welcome: 'Vue.jsアプリケーションへようこそ'
    }
  }
}

const i18n = new VueI18n({
  locale: 'ja',
  messages
})

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')

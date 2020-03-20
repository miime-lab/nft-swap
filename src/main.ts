import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.use(VueI18n);
Vue.config.productionTip = false;

const messages = {
    en: {
        message: {
            serviceName: "NFTswap",
            tab_new: "New",
            tab_task: "Task",
            card_title_sending: "SENDING",
            card_title_sending_weth: "SENDING WETH",
            card_title_receiving: "RECEIVING",
            card_title_receiving_weth: "RECEIVING WETH",
            card_input_label_url: "OpenSea or miime URL",
            button_makeOrder: "Make Order",
            button_fillOrder: "Fill Order",
            modal_makeOrder_title: "Order Confirmation",
            modal_makeOrder_title_approve:
                "Unlock all Trust Collectibles for trading!",
            modal_makeOrder_message:
                "To approve miime to trade this token, you must first complete a free (plus gas) transaction. Keep this tab open! This only needs to be done once for all Trust Collectibles items.",
            modal_makeOrder_approve: "Approve",
            modal_makeOrder_cancel: "Cancel"
        }
    },
    ja: {
        message: {
            serviceName: "NFTswap",
            tab_new: "新規",
            tab_task: "タスク",
            card_title_sending: "送付アイテム",
            card_title_sending_weth: "送付 WETH",
            card_title_receiving: "受取アイテム",
            card_title_receiving_weth: "受取 WETH",
            card_input_label_url: "OpenSea または miime の URL",
            button_makeOrder: "オーダー作成",
            button_fillOrder: "取引を実行",
            modal_makeOrder_title: "オーダーの確認",
            modal_makeOrder_title_approve: "取引許可",
            modal_makeOrder_message:
                "このトークンの取引を行うには、最初に取引許可のトランザクションを完了する必要があります。これは、トークンのコントラクトごとに1回だけ実行する必要があります。",
            modal_makeOrder_approve: "許可",
            modal_makeOrder_cancel: "キャンセル",
        }
    }
}

const i18n = new VueI18n({
    locale: "ja",
    messages
});

new Vue({
    router,
    vuetify,
    i18n,
    render: h => h(App)
}).$mount("#app");

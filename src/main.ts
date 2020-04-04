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
            card_title_sending_weth: "SENDING WETH (Optional)",
            card_title_receiving: "RECEIVING",
            card_title_receiving_weth: "RECEIVING WETH (Optional)",
            card_input_label_url: "OpenSea or miime URL",
            button_makeOrder: "Order Creation",
            modal_error_title: "Error",
            modal_approval_title: "Allowance",
            modal_signing_title: "Signing",
            modal_completed_title: "Order Creation Completed",
            modal_waiting_signing_message: "Please sign the order.",
            modal_error_no_asset: "Please input at least one asset for both",
            modal_makeOrder_title: "Create Order",
            modal_completed_message: "Order creation is complete. Please share the following URL to your trading partner.",
            modal_completed_move_to_order_page: "Move to Order page",
            modal_completed_move_to_new_page: "Move to New page",
            modal_completed_move_to_task_page: "Move to Task page",
            modal_makeOrder_title_approve:
                "Unlock all Trust Collectibles for trading!",
            modal_makeOrder_headline_contract: "Contract",
            modal_makeOrder_headline_expiration_date: "Expiration Date",
            modal_makeOrder_headline_sending_side: "Sending",
            modal_makeOrder_headline_receiving_side: "Receiving",
            modal_makeOrder_headline_address: "Address",
            modal_makeOrder_headline_assets: "Assets",
            modal_makeOrder_headline_fee: "Fee",    
            modal_makeOrder_message:
                "To approve miime to trade this token, you must first complete a free (plus gas) transaction. Keep this tab open! This only needs to be done once for all Trust Collectibles items.",
            modal_makeOrder_create: "Create",
            modal_makeOrder_cancel: "Cancel",
            error_invalid_asset_url: "Please input OpenSea or miime URL",
            error_already_input_asset: "The asset is already input.",
            order_page: {
                card_title_orderDetail: "Order Detail",
                headline_sending_side: "Sending",
                headline_receiving_side: "Receiving",
                headline_maker_side: "Maker Side",
                headline_taker_side: "Taker Side",
                modal_sending_title: "Fill Order",
                modal_waiting_send_tx: "Waiting for order filling transaction to confirmed.",
                modal_completed_message: "Transaction Sending Completed"
            }
        }
    },
    ja: {
        message: {
            serviceName: "NFTswap",
            tab_new: "新規",
            tab_task: "タスク",
            card_title_sending: "送付アイテム",
            card_title_sending_weth: "送付 WETH（任意）",
            card_title_receiving: "受取アイテム",
            card_title_receiving_weth: "受取 WETH（任意）",
            card_input_label_url: "OpenSea または miime の URL",
            button_makeOrder: "オーダー作成",
            button_fillOrder: "取引を実行",
            modal_error_title: "エラー",
            modal_approval_title: "取引許可",
            modal_signing_title: "オーダーへの署名",
            modal_completed_title: "オーダー作成完了",
            modal_waiting_signing_message: "オーダーに署名してください。",
            modal_completed_message: "オーダーの作成が完了しました。次の URL を取引相手に共有してください。",
            modal_completed_move_to_order_page: "オーダーを確認",
            modal_completed_move_to_new_page: "新しくオーダーを作成",
            modal_completed_move_to_task_page: "自分のオーダーを確認",
            modal_error_no_asset: "送信/受信それぞれ1つ以上アセットを入力してください",
            modal_makeOrder_title: "オーダーの作成",
            modal_makeOrder_title_approve: "取引許可",
            modal_makeOrder_headline_contract: "コントラクト",
            modal_makeOrder_headline_expiration_date: "有効期限",
            modal_makeOrder_headline_sending_side: "送付",
            modal_makeOrder_headline_receiving_side: "受取",
            modal_makeOrder_headline_address: "アドレス",
            modal_makeOrder_headline_assets: "アセット",
            modal_makeOrder_headline_fee: "手数料",
            modal_makeOrder_message:
                "このトークンの取引を行うには、最初に取引許可のトランザクションを完了する必要があります。これは、トークンのコントラクトごとに1回だけ実行する必要があります。",
            modal_makeOrder_create: "作成",
            modal_makeOrder_cancel: "キャンセル",
            error_invalid_asset_url: "アセット詳細ページの URL を入力してください",
            error_already_input_asset: "このアセットはすでに入力済みです",
            order_page: {
                card_title_orderDetail: "オーダーの詳細",
                headline_sending_side: "送付",
                headline_receiving_side: "受取",
                headline_maker_side: "メイカー側",
                headline_taker_side: "テイカー側",
                modal_sending_title: "オーダーの実行",
                modal_waiting_send_tx: "オーダー実行のトランザクションが完了するのを待っています。",
                modal_completed_message: "トランザクション送信完了"
            }
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

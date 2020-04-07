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
            tab_history: "History",
            tab_order: "Order",
            card_title_sending: "SENDING",
            card_title_sending_weth: "SENDING WETH (not required)",
            card_title_receiving: "RECEIVING",
            card_title_receiving_weth: "RECEIVING WETH (not required)",
            card_input_label_url: "Input OpenSea or miime URL",
            button_makeOrder: "Create order",
            button_fillOrder: "Fill Order",
            button_deleteOrder: "Delete",
            button_reset: "Reset",
            button_load_more: "Load More",
            headline_order_id: "Order ID",
            headline_updated_at: "Updated At",
            headline_status: "Status",
            headline_balance: "Balance",
            headline_no_task: "There is no task. The orders you should send transaction are displayed here.",
            headline_no_history: "There is no history. The orders you create will appear here.",
            modal_error_title: "Error",
            modal_approval_title: "Allowance",
            modal_signing_title: "Signing",
            modal_completed_title: "Order Created",
            modal_waiting_signing_message: "Please sign the order.",
            modal_error_no_asset: "Please input at least one asset for both",
            modal_error_wrong_owner: "Items with different owners are mixed",
            modal_error_wrong_signer: "Item owner and current signing address are different",
            modal_error_owner_changed: "wrong owner of asset",
            modal_error_weth_insufficient_balance: "Insufficient WETH balance",
            modal_makeOrder_title: "Create Order",
            modal_completed_message: "Order creation is complete. Please share the following URL to your trading partner.",
            modal_completed_clipboard_copy_done: "URL copied.",
            modal_completed_move_to_order_page: "Move to Order page",
            modal_completed_move_to_new_page: "Move to New page",
            modal_completed_move_to_task_page: "Move to Task page",
            modal_makeOrder_title_approve:
                "Approval for trading.",
            modal_makeOrder_headline_contract: "Contract",
            modal_makeOrder_headline_expiration_date: "Expiration Date",
            modal_makeOrder_headline_sending_side: "Sending",
            modal_makeOrder_headline_receiving_side: "Receiving",
            modal_makeOrder_headline_address: "Address",
            modal_makeOrder_headline_assets: "Assets",
            modal_makeOrder_headline_fee: "Fee",
            modal_makeOrder_message:
                "Keep this tab open! To approve nftswap to trade this token, you must complete transaction for approval of the trading.  This only needs to be done once for all Trust Collectibles items.",
            modal_makeOrder_create: "Create",
            modal_makeOrder_cancel: "Cancel",
            error_invalid_asset_url: "Please input OpenSea or miime URL",
            error_unsupported_token_standard: "Sorry, this token standard is not supported",
            error_not_my_token: "You don't own this token.",
            error_already_input_asset: "The asset is already input.",
            error_same_owner_assets: "Assets with the same owner cannot be swap",
            order_page: {
                order_status: {
                    INVALID: "Invalid",
                    INVALID_MAKER_ASSET_AMOUNT: "Invalid",
                    INVALID_TAKER_ASSET_AMOUNT: "Invalid",
                    FILLABLE: "Fillable",
                    EXPIRED: "Expired",
                    FULLY_FILLED: "Filled",
                    CANCELLED: "Cancelled"
                },
                card_title_orderDetail: "Order Detail",
                headline_sending_side: "Sending",
                headline_receiving_side: "Receiving",
                headline_maker_side: "Maker Side",
                headline_taker_side: "Taker Side",
                headline_order_status: "Status",
                modal_sending_title: "Fill Order",
                modal_waiting_send_tx: "Waiting for order filling transaction to confirmed.",
                modal_completed_title: "Order Filling Completed",
                modal_completed_message: "Congratulations. Order filling is completed.",
                modal_delete_confirmation_title: "Order Delete Confirmation",
                modal_delete_confirmation_message: "Are you sure you want to delete the order?",
                modal_delete_confirmation_delete: "Delete",
                modal_delete_confirmation_cancel: "Cancel",    
                button_url_copy_title: "Copy URL",
                url_copy_done: "URL copied."
            }
        }
    },
    ja: {
        message: {
            serviceName: "NFTswap",
            tab_new: "新規",
            tab_task: "タスク",
            tab_history: "履歴",
            tab_order: "Order",
            card_title_sending: "あなたが送るアイテム",
            card_title_sending_weth: "あなたが送る WETH（任意）",
            card_title_receiving: "相手が送るアイテム",
            card_title_receiving_weth: "相手が送る WETH（任意）",
            card_input_label_url: "OpenSea または miime の URL",
            button_makeOrder: "オーダー作成",
            button_fillOrder: "取引を実行",
            button_deleteOrder: "削除",
            button_reset: "リセット",
            button_load_more: "もっと見る",
            headline_order_id: "オーダーID",
            headline_updated_at: "更新日",
            headline_status: "ステータス",
            headline_balance: "残高",
            headline_no_task: "タスクは1件もありません。あなたが実行者のオーダーがここに表示されます。",
            headline_no_history: "履歴は1件もありません。あなたが作成したオーダーがここに表示されます。",
            modal_error_title: "エラー",
            modal_approval_title: "取引許可",
            modal_signing_title: "オーダーへの署名",
            modal_completed_title: "オーダー作成完了",
            modal_waiting_signing_message: "オーダーに署名してください。",
            modal_completed_message: "オーダーの作成が完了しました。次の URL を取引相手に共有してください。",
            modal_completed_clipboard_copy_done: "URLをコピーしました。",
            modal_completed_move_to_order_page: "オーダーを確認",
            modal_completed_move_to_new_page: "新しくオーダーを作成",
            modal_completed_move_to_task_page: "自分のオーダーを確認",
            modal_error_no_asset: "あなた/相手のアイテムをそれぞれ1つ以上入力してください",
            modal_error_wrong_owner: "所有者が異なるアイテムが混在しています",
            modal_error_wrong_signer: "アイテムの所有者と、現在の署名アドレスが違います",
            modal_error_owner_changed: "アイテムの所有者が異なります",
            modal_error_weth_insufficient_balance: "WETHの残高が不足しています",
            modal_makeOrder_title: "オーダーの作成",
            modal_makeOrder_title_approve: "取引許可",
            modal_makeOrder_headline_contract: "コントラクト",
            modal_makeOrder_headline_expiration_date: "有効期限",
            modal_makeOrder_headline_sending_side: "あなたが送るアイテム",
            modal_makeOrder_headline_receiving_side: "相手が送るアイテム",
            modal_makeOrder_headline_address: "アドレス",
            modal_makeOrder_headline_assets: "アイテム",
            modal_makeOrder_headline_fee: "手数料",
            modal_makeOrder_message:
                "このトークンの取引を行うには、最初に取引許可のトランザクションを完了する必要があります。これは、トークンのコントラクトごとに1回だけ実行する必要があります。",
            modal_makeOrder_create: "作成",
            modal_makeOrder_cancel: "キャンセル",
            error_invalid_asset_url: "アイテム詳細ページの URL を入力してください",
            error_not_my_token: "あなたはこのトークンの所有者ではありません。",
            error_unsupported_token_standard: "申し訳ありませんがこのトークン規格には対応していません",
            error_already_input_asset: "このアイテムはすでに入力済みです",
            error_same_owner_assets: "同じ所有者のアイテムを追加しようとしています",
            order_page: {
                order_status: {
                    INVALID: "無効",
                    INVALID_MAKER_ASSET_AMOUNT: "無効",
                    INVALID_TAKER_ASSET_AMOUNT: "無効",
                    FILLABLE: "取引実行待ち",
                    EXPIRED: "期限切れ",
                    FULLY_FILLED: "取引成立済み",
                    CANCELLED: "キャンセル済み"
                },
                card_title_orderDetail: "オーダーの詳細",
                headline_sending_side: "あなたが送るアイテム",
                headline_receiving_side: "相手が送るアイテム",
                headline_maker_side: "メイカー側",
                headline_taker_side: "テイカー側",
                headline_order_status: "ステータス",
                modal_sending_title: "オーダーの実行",
                modal_waiting_send_tx: "オーダー実行のトランザクションが完了するのを待っています。",
                modal_completed_title: "オーダー実行完了",
                modal_completed_message: "おめでとうございます。オーダーの実行が完了しました。",
                modal_delete_confirmation_title: "オーダー削除確認",
                modal_delete_confirmation_message: "オーダーを削除します。よろしいですか？",
                modal_delete_confirmation_delete: "削除",
                modal_delete_confirmation_cancel: "キャンセル",    
                button_url_copy_title: "URL をコピー",
                url_copy_done: "コピーしました。"
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

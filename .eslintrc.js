module.exports = {
    root: true,

    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },

    env: {
        browser: true,
        node: true
    },

    extends: [
        'plugin:vue/recommended',
    ],

    // required to lint *.vue files
    plugins: [
        'vue'
    ],

    // add your custom rules here
    rules: {
        indent: [
            2
        ]
    },

    globals: {},

}

module.exports = {
  root: true,
  parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends:[
    'plugin:vue/recommended',
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    "indent": [
      2
    ]
  },
  globals: {}
}

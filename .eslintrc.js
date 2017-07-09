module.exports = {
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  plugins: [
    'html'
  ],
  env: {
    'browser': true,
    'node': true
  },
  settings: {
    'html/html-extensions': ['.vue']
  },
  rules: {
    'vue/html-end-tags': 'error',
    'vue/html-no-self-closing': 'error',
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/no-duplicate-attributes': 'error',
    'vue/no-textarea-mustache': 'error',
    'vue/order-in-components': 'error',
    'vue/require-component-is': 'error',
    'vue/require-v-for-key': 'error',
    'vue/html-quotes': 'error',
    'vue/v-bind-style': 'error',
    'vue/v-on-style': 'error',
    'vue/jsx-uses-vars': 'error',
    'vue/no-invalid-template-root': 'error',
    'vue/no-invalid-v-bind': 'error',
    'vue/no-invalid-v-cloak': 'error',
    'vue/no-invalid-v-else-if': 'error',
    'vue/no-invalid-v-else': 'error',
    'vue/no-invalid-v-for': 'error',
    'vue/no-invalid-v-html': 'error',
    'vue/no-invalid-v-if': 'error',
    'vue/no-invalid-v-model': 'error',
    'vue/no-invalid-v-on': 'error',
    'vue/no-invalid-v-once': 'error',
    'vue/no-invalid-v-pre': 'error',
    'vue/no-invalid-v-show': 'error',
    'vue/no-invalid-v-text': 'error'
  }
}
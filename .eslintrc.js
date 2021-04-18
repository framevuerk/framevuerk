module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  parser: 'vue-eslint-parser',
  rules: {
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style']
      }
    ],
    'max-len': 'off',
  }
}

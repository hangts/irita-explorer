module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/airbnb',
    'plugin:prettier/recommended', // 添加 prettier 插件
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'generator-star-spacing': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-tabs': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    'prettier/prettier': 'error',
  },
};

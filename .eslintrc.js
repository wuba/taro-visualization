module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'import', 'eslint-comments'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    'eslint-comments/no-unused-disable': 'error',
    'import/order': ['error', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }]
  }
};

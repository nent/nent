// @ts-check
const stencilPlugin = require('@stencil/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const prettierPlugin = require('eslint-plugin-prettier')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    ignores: [
      'coverage/**',
      '**/dist/**',
      '**/node_modules/**',
      'www/**',
      '**/test/**',
      '**/__mocks__/**',
      '**/assets/**',
      '**/lib/**',
      '**/*.md',
      '**/stats/**',
      'packages/vscode/**',
      'packages/create/**',
      'examples/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  },
  {
    ...stencilPlugin.configs.flat.recommended,
    files: ['packages/core/src/**/*.{ts,tsx}'],
    plugins: {
      ...stencilPlugin.configs.flat.recommended.plugins,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './packages/core/tsconfig.json',
        ecmaVersion: 2018,
      },
    },
    settings: {
      react: { version: '16.7' },
    },
    rules: {
      ...stencilPlugin.configs.flat.recommended.rules,
      'stencil/strict-boolean-conditions': 0,
      'stencil/strict-mutable': 0,
      'stencil/decorators-style': 0,
      'stencil/ban-exported-const-enums': 0,
      'stencil/ban-side-effects': 0,
      '@typescript-eslint/naming-convention': 0,
      '@typescript-eslint/lines-between-class-members': 0,
      'react/react-in-jsx-scope': 0,
      'react/self-closing-comp': 0,
      'react/no-unescaped-entities': 0,
      'react/no-unknown-property': 0,
      'react/jsx-no-bind': 0,
      'react/jsx-closing-bracket-location': 0,
      'react/jsx-one-expression-per-line': 0,
      'react/jsx-tag-spacing': 0,
      'jsx-a11y/no-static-element-interactions': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'import/prefer-default-export': 0,
      'function-paren-newline': 0,
      'linebreak-style': 0,
      'no-restricted-syntax': 0,
      'object-curly-spacing': 0,
      'object-curly-newline': 0,
      'no-plusplus': 0,
      'class-methods-use-this': 0,
      'no-undef': 0,
      'prettier/prettier': [1, { usePrettierRc: true }],
    },
  },
]

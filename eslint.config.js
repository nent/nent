/* eslint-disable */
const stencilPlugin = require('@stencil/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')

module.exports = [
  {
    ignores: [
      'coverage/**',
      '**/dist/**',
      '**/node_modules/**',
      'www/**',
      'test/**',
      '**/__mock__/**',
      'assets/**',
      'lib/**',
      'stats/**',
      'packages/vscode/**',
      'create/**',
      'examples/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.e2e.ts',
      '**/*.e2e.tsx',
    ],
  },
  {
    files: ['packages/core/src/**/*.ts', 'packages/core/src/**/*.tsx'],
    plugins: stencilPlugin.configs.flat.recommended.plugins,
    languageOptions: {
      ...stencilPlugin.configs.flat.recommended.languageOptions,
      parser: tsParser,
    },
    rules: {
      ...stencilPlugin.configs.flat.recommended.rules,
      // Rules disabled for compatibility with codebase conventions
      'stencil/strict-boolean-conditions': 0,
      'stencil/strict-mutable': 0,
      'stencil/decorators-style': 0,
      // Codebase uses const enums and top-level calls extensively
      'stencil/ban-exported-const-enums': 0,
      'stencil/ban-side-effects': 0,
    },
  },
]

module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2017
  },
  extends: [
    "plugin:@stencil/recommended"
  ],
  settings: {
    react: {
      "version": "16.7"
    }
  },
  plugins: ["prettier"],
  rules: {
    '@stencil/strict-boolean-conditions': 0,
    '@stencil/strict-mutable': 0,
    '@stencil/decorators-style': 0,
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
    'prettier/prettier': "error"
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
  ],
  ignorePatterns: ['__mocks__'],
}

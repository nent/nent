
// const colors = require( 'tailwindcss/colors' )

const { white } = require( 'chalk' )

module.exports = {
  mode: 'jit',
  purge: [
    './**/*.html',
    './**/*.{ts}',
  ],
  darkMode: 'class',
  variants: {
    dark: {}
  },
  plugins: [
    // require('@tailwindcss/typography'),
  ],
  theme: {}
}

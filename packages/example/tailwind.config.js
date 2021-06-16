
// const colors = require( 'tailwindcss/colors' )

module.exports = {
  mode: 'jit',
  purge: [
    './**/*.html',
    './**/*.{ts}',
  ],
  darkMode: 'class',
  variants: {
    extend: {},
  },
  plugins: [
    // require('@tailwindcss/typography'),
  ],
  theme: {}
}

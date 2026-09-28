const {guessProductionMode} = require("@ngneat/tailwind");
const plugin = require('tailwindcss/plugin')
process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
  prefix: '',
  mode: 'jit',
  purge: {
    content: [
      './src/**/*.{html,ts,css,scss,sass,less,styl}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'),  plugin(function({ addComponents }) {
    addComponents({
      '.btn': {
        padding: '.5rem 1rem',
        borderRadius: '.25rem',
        fontWeight: '600',
      },
      '.btn-blue': {
        backgroundColor: '#3490dc',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#2779bd'
        },
      },
      '.btn-red': {
        backgroundColor: '#e3342f',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#cc1f1a'
        },
      },
    })
  })
],
};

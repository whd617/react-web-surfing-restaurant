const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.tsx'],
  content: [],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
  },
  variants: {
    extends: {},
  },
  plugins: [],
};

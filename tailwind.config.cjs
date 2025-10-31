/******************************************************************************
 * Tailwind configuration (CommonJS)                                           *
 ******************************************************************************/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5ff',
          100: '#d9e9ff',
          200: '#b9d5ff',
          300: '#8fbaff',
          400: '#5a96ff',
          500: '#2f74ff',
          600: '#1e5bef',
          700: '#1a49c2',
          800: '#1a4199',
          900: '#1a387a',
        },
      },
    },
  },
  plugins: [],
}

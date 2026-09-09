/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4EF',
        linen: '#EFE8DC',
        sand: '#C9B79A',
        wood: '#8C7355',
        ink: '#1C1917',
        stone: '#57534E',
        gold: '#A68B5B',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', 'serif'],
      },
      maxWidth: {
        page: '1280px',
      },
    },
  },
  plugins: [],
};

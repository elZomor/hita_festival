/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theatre: {
          black: '#0a0a0a',
          red: {
            DEFAULT: '#8B1538',
            light: '#A91D42',
            dark: '#6B0F2A',
          },
          gold: {
            DEFAULT: '#C9A962',
            light: '#D4B876',
            dark: '#B8994E',
          },
          cream: '#F5F1E8',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
        arabic: ['Noto Naskh Arabic', 'Georgia', 'serif'],
      },
      spacing: {
        '8': '2rem',
        '16': '4rem',
        '24': '6rem',
      },
    },
  },
  plugins: [],
};

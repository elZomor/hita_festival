/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ================= BASE / BACKGROUND ================= */
        primary: {
          50: '#f6f3ef',
          100: '#e8e1d9',
          200: '#cfc4b7',
          300: '#b19d86',
          400: '#856f67',
          500: '#584136',
          600: '#473d37',
          700: '#312924',
          800: '#211814',
          900: '#0b0807',
          950: '#050403',
        },

        /* ================= GOLD / TITLES ================= */
        secondary: {
          50: '#fbf6ee',
          100: '#f3e7d3',
          200: '#e2cfa8',
          300: '#c9b07b',
          400: '#a47139',
          500: '#8f5f2e',
          600: '#734b24',
          700: '#58391c',
          800: '#3f2a15',
          900: '#2a1c0e',
          950: '#160f07',
        },

        /* ================= DRAMATIC RED ================= */
        accent: {
          50: '#f6eef1',
          100: '#e6cfd7',
          200: '#cfa0af',
          300: '#b16d85',
          400: '#8f3f5f',
          500: '#682745',
          600: '#58203a',
          700: '#44182d',
          800: '#311120',
          900: '#1f0a14',
          950: '#11050b',
        },

        /* ================= THEATRE SYSTEM ================= */
        theatre: {
          black: {
            900: '#0b0807',
            950: '#050403',
          },

          curtain: {
            500: '#682745',
          },

          gold: {
            500: '#a47139',
          },

          wood: {
            500: '#584136',
          },

          parchment: {
            50: '#f6f3ef',
          },
        },

        /* ================= STATUS ================= */
        reservation: {
          500: '#a47139',
          600: '#8f5f2e',
        },

        waiting: {
          500: '#682745',
          600: '#58203a',
        },
      },

      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Roboto', 'sans-serif'],
      },

      boxShadow: {
        'glow-dark': '0 0 40px rgba(0,0,0,0.65)',
      },
    },
  },
  plugins: [],
};

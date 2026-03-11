/** @type {import('tailwindcss').Config} */
import { loadEnv } from 'vite';

const modeIdx = process.argv.indexOf('--mode');
const mode = modeIdx !== -1 ? process.argv[modeIdx + 1] : 'development';
const env = loadEnv(mode, process.cwd(), '');
const festival = env.VITE_FESTIVAL ?? process.env.VITE_FESTIVAL ?? 'arabic';

const palettes = {
  arabic: {
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

  global: {
    /* ================= BASE / BACKGROUND ================= */
    primary: {
      50:  '#f5f4f2',
      100: '#e8e4df',
      200: '#d0c9c0',
      300: '#b0a698',
      400: '#8c7d6e',
      500: '#6b5d50',
      600: '#4e4238',
      700: '#352c24',
      800: '#221c16',
      900: '#14100c',
      950: '#0c0906',
    },

    /* ================= EMERALD GREEN / TITLES ================= */
    secondary: {
      50:  '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#059669',
      600: '#047857',
      700: '#065f46',
      800: '#064e3b',
      900: '#022c22',
      950: '#011a15',
    },

    /* ================= TEAL ACCENT ================= */
    accent: {
      50:  '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },

    /* ================= THEATRE SYSTEM ================= */
    theatre: {
      black: {
        900: '#14100c',
        950: '#0c0906',
      },
      curtain: {
        500: '#14b8a6',
      },
      gold: {
        500: '#059669',
      },
      wood: {
        500: '#6b5d50',
      },
      parchment: {
        50: '#f5f4f2',
      },
    },

    /* ================= STATUS ================= */
    reservation: {
      500: '#059669',
      600: '#047857',
    },

    waiting: {
      500: '#14b8a6',
      600: '#0d9488',
    },
  },
};

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: palettes[festival] ?? palettes.arabic,

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

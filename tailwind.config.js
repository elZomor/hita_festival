/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0b0f19',
        },

        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },

        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },

        theatre: {
          // Black scale
          black: {
            900: '#0a0a0a',
            950: '#050505',
          },

          // Your red converted to a proper scale
          red: {
            400: '#A91D42', // light
            500: '#8B1538', // DEFAULT
            600: '#6B0F2A', // dark
          },

          // Gold converted to scale
          gold: {
            400: '#D4B876', // light
            500: '#C9A962', // DEFAULT
            600: '#B8994E', // dark
          },

          // Cream as 50
          cream: {
            50: '#F5F1E8',
          },
        },
      },

      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Roboto', 'sans-serif'],
      },

      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'light-left': 'light-left 1.8s ease-in-out infinite',
        'light-right': 'light-right 1.8s ease-in-out infinite',
        'light-down': 'light-down 2s ease-in-out infinite',
        'fade-in-out': 'fade-in-out 2s ease-in-out infinite',
      },

      keyframes: {
        'light-left': {
          '0%, 100%': { transform: 'rotate(40deg)' },
          '50%': { transform: 'rotate(50deg)' },
        },
        'light-right': {
          '0%, 100%': { transform: 'rotate(-40deg)' },
          '50%': { transform: 'rotate(-50deg)' },
        },
        'light-down': {
          '0%, 100%': { height: '4rem' },
          '50%': { height: '6rem' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

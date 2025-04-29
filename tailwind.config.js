const { keyframes } = require('motion');

module.exports = {
  mode: 'jit',
  purge: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        subtlePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
      },
      animation: {
        subtlePulse: 'subtlePulse 2s ease-in-out infinite',
      },

      fontFamily: {
        mono: ['var(--font-space-mono)', 'monospace'],
        rubik: ['var(--font-rubik)', 'rubik'],
      },
      backgroundImage: {
        blueGradient:
          'linear-gradient(169deg, rgba(0, 16, 51, 1) 32%, #002a65 67%, rgba(2, 95, 173, 1) 100%)',
        greenYellowGradient:
          'linear-gradient(to bottom, rgba(177,204,112,0.2) 50%)',
      },
      transitionDuration: {
        0: '0ms',
        2000: '2000ms',
        4000: '4000ms',
      },
    },
  },
  variants: {
    extend: {},
    display: ['responsive', 'group-hover', 'group-focus'],
  },
  plugins: [],
};

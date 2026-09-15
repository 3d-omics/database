/** @type {import('tailwindcss').Config} */
const themes = require('daisyui/src/theming/themes')
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'burgundy': '#741B47',
        'light_burgundy': '#9D2560',
        'mustard': '#BF910A',
        'light_mustard': '#f9db85',
        'custom_black': '#555555',
        'custom_light_black': '#939393',
        surface: token('surface'),
        surface_subtle: token('surface-subtle'),
        surface_muted: token('surface-muted'),
        surface_strong: token('surface-strong'),
        line: token('line'),
        line_strong: token('line-strong'),
        ink: token('ink'),
        ink_muted: token('ink-muted'),
        burgundy_ink: token('burgundy-ink'),
      },
      borderWidth: {
        '1': '1px',
        '1.5': '1.5px',
        '3': '3px',
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        '3xs': '0.5rem', // 8px
      },
      keyframes: {
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }
        },
        blink: {
          "50%": {
            borderColor: "transparent"
          },
          "100%": {
            borderColor: "white"
          }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" }
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "none" }
        }
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-in-right": "slide-in-right 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        // `both` keeps a block hidden while it waits out its stagger delay
        "rise-in": "rise-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwind-hamburgers'),
    function ({ addUtilities }) {
      addUtilities({
        '.clip-arrow': {
          'clip-path': 'polygon(50% 25%, 100% 0, 100% 75%, 50% 100%, 0 75%, 0 0)',
        },
        '.clip-arrow-last': {
          'clip-path': 'polygon(50% 25%, 100% 0, 100% 100%, 0 100%, 0 0)',
        },
        '.clip-arrow-first': {
          'clip-path': 'polygon(100% 10%, 100% 75%, 50% 100%, 0 75%, 0 10%)',
        },
        '.clip-triangle': {
          'clip-path': 'polygon(0 0, 100% 50%, 0 100%)',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    },
  ],
  daisyui: {
    base: false,
    themes: [
      'light',
      {
        dark: {
          ...themes.dark,
          'base-100': '#16181b',
          'base-200': '#1c1f23',
          'base-300': '#2c3137',
          'base-content': '#d4d4d4',
        },
      },
    ],
    darkTheme: 'dark',
  },
}

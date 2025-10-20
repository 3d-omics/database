/** @type {import('tailwindcss').Config} */
module.exports = {
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
        'burgundy': '#741B47', // 751a47
        'light_burgundy': '#9D2560',
        'mustard': '#BF910A',
        'light_mustard': '#f9db85',
        'custom_black': '#555555',
        'custom_light_black': '#939393',
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
        }
      },
      animation: {
        typing: "typing 2s steps(40) 1 alternate, blink 1"
        // typing: "typing 2s steps(40) infinite alternate, blink 0.7s infinite"
      }
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
      })
    },
  ],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f5',
          100: '#ffe0eb',
          200: '#ffc2d6',
          300: '#ff94b8',
          400: '#ff5c94',
          500: '#ff2e88',
          600: '#ed1570',
          700: '#c90d5c',
          800: '#a50e4f',
          900: '#8a1046',
        },
        secondary: {
          50: '#f5f0ff',
          100: '#ede0ff',
          200: '#dec2ff',
          300: '#c794ff',
          400: '#af5cff',
          500: '#7b2cbf',
          600: '#6a1fad',
          700: '#59188f',
          800: '#4a1675',
          900: '#3f1460',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}


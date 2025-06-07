/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: 'white',
        foreground: '#0ea5e9',
        card: 'white',
        'card-foreground': '#0ea5e9',
        popover: 'white',
        'popover-foreground': '#0ea5e9',
        primary: {
          DEFAULT: '#0ea5e9',
          foreground: 'white',
        },
        secondary: {
          DEFAULT: '#f0f9ff',
          foreground: '#0ea5e9',
        },
        muted: {
          DEFAULT: '#f0f9ff',
          foreground: '#0ea5e9',
        },
        accent: {
          DEFAULT: '#bae6fd',
          foreground: '#0ea5e9',
        },
        border: '#e0f2fe',
        input: '#e0f2fe',
        ring: '#0ea5e9',
      },
    },
  },
  plugins: [],
}

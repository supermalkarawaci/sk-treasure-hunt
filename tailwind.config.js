/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#121421',
        secondary: '#D4AF37',
        accent: '#1F2937',
        gold: '#D4AF37',
        'dark-gray': '#1F2937',
        'light-gray': '#F8FAFC',
        'white-600': '#F3F4F6',
        'white-700': '#E5E7EB',
        'onyx-gray': '#2A2F3A',
        'black-600': '#1F2937',
        'green-success': '#10B981',
        'red-error': '#EF4444',
        'text-light': '#F8FAFC',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-gold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};
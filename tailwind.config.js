/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A0F1E',
          800: '#111827',
          700: '#1E293B',
          600: '#2D3748',
          500: '#4A5568',
        },
        gold: {
          300: '#FAE98A',
          400: '#F6D860',
          500: '#E8C43D',
          600: '#D4A017',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-top': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'badge-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232, 196, 61, 0)' },
          '50%': { boxShadow: '0 0 0 5px rgba(232, 196, 61, 0.15)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-top': 'slide-in-top 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'modal-in': 'modal-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'badge-pulse': 'badge-pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

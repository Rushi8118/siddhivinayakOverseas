/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', '"Montserrat"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', '"Open Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Poppins"', 'serif'],
      },
      colors: {
        // Light Sky-Blue brand palette (Siddhivinayak Overseas)
        sky: {
          50:  '#F0F9FF',
          100: '#E0F2FE',
          200: '#C2E6F5', // secondary background (per brief)
          300: '#A7D9EE',
          400: '#87CEEB', // primary background (per brief)
          500: '#5EB8E0',
          600: '#3A9BCB',
          700: '#2B7BA5',
          800: '#1F5B7D',
          900: '#163F57',
        },
        // Deep navy used only for text and strong accents
        navy: {
          50:  '#EEF4FA',
          100: '#D4E2EF',
          200: '#A8C5DF',
          300: '#7BA8CF',
          400: '#4F8BBF',
          500: '#2F6FA3',
          600: '#245686',
          700: '#1A3E62',
          800: '#102844',
          900: '#0F2A44', // brand text
          950: '#081828',
        },
        // Premium Gold accent
        gold: {
          50:  '#FDF7E6',
          100: '#FAEDBF',
          200: '#F3D88A',
          300: '#E9C35C',
          400: '#DCAE3C',
          500: '#D4AF37', // brand gold
          600: '#B3922A',
          700: '#8C7120',
          800: '#665217',
          900: '#40340E',
        },
        // Supporting teal / trust tone
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        royal: {
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'plane': 'plane 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        'gradient-xy': {
          '0%, 100%': { 'background-position': '0% 0%' },
          '50%':      { 'background-position': '100% 100%' },
        },
        shimmer: {
          '0%':   { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        glow: {
          '0%':   { 'box-shadow': '0 0 20px rgba(212, 175, 55, 0.25)' },
          '100%': { 'box-shadow': '0 0 40px rgba(212, 175, 55, 0.55)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        plane: {
          '0%':   { transform: 'translate(-10%, 40%) rotate(-8deg)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translate(110%, -20%) rotate(-8deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-sky':  'linear-gradient(180deg, #F0F9FF 0%, #C2E6F5 55%, #87CEEB 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E9C35C 0%, #D4AF37 50%, #B3922A 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(212, 175, 55, 0.35)',
        'glow-sky':  '0 0 30px rgba(135, 206, 235, 0.45)',
        'premium':   '0 25px 50px -12px rgba(15, 42, 68, 0.18)',
        'card':      '0 10px 25px -5px rgba(15, 42, 68, 0.10), 0 4px 10px -2px rgba(15, 42, 68, 0.06)',
        'soft':      '0 4px 20px rgba(15, 42, 68, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

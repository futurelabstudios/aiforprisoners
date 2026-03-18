/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm parchment + terracotta brand palette
        navy: {
          50:  '#FAF6EE',   // warm light surface
          100: '#EDE5D5',   // warm chip / border
          600: '#6B3A1F',   // warm mid brown
          700: '#502A10',   // warm dark brown
          800: '#3D1A08',   // deepest brown (was dark blue)
          900: '#2A1005',
          950: '#1A0802',
        },
        saffron: {
          400: '#D4692E',   // terracotta light
          500: '#C85828',   // terracotta primary
          600: '#A84420',   // terracotta dark
        },
        jade: {
          500: '#16a34a',
          600: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs':   '0.8rem',
        'sm':   '0.9rem',
        'base': '1.05rem',
        'lg':   '1.2rem',
        'xl':   '1.35rem',
        '2xl':  '1.6rem',
        '3xl':  '2rem',
        '4xl':  '2.4rem',
      },
      animation: {
        'pulse-slow':    'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 1.5s infinite',
      },
    },
  },
  plugins: [],
}

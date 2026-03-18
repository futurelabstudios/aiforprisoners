/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C85828',
          dark:    '#8B3215',
          light:   '#FEF0E8',
          ink:     '#1C0A02',
        },
        surface: '#FFFFFF',
        page:    '#F7F6F3',
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
    },
  },
  plugins: [],
}

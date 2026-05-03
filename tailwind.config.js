export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        gray: {
          50:  '#F8F8F8',
          100: '#F2F2F2',
          150: '#EBEBEB',
          200: '#E0E0E0',
          300: '#C8C8C8',
          400: '#ABABAB',
          500: '#888888',
          600: '#666666',
          700: '#444444',
          800: '#2A2A2A',
          900: '#1A1A1A',
          950: '#0D0D0D',
        }
      }
    }
  },
  plugins: []
}

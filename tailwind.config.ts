import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F3E8DA',
        brown: {
          DEFAULT: '#5B3B2C',
          light: '#8a6050',
          mid: '#7a5040',
        },
        'nami-blue': '#A8C9DD',
        dark: '#2A2624',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      animation: {
        'wave-float': 'waveFloat 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.9s ease forwards',
        'draw-line': 'drawLine 1.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      },
      keyframes: {
        waveFloat: {
          '0%, 100%': { d: 'path("M4 24 C22 24, 28 8, 48 8 C68 8, 74 24, 94 24 C114 24, 120 8, 140 8 C160 8, 166 24, 186 24 C198 24, 208 17, 218 14")' },
          '50%': { d: 'path("M4 18 C22 18, 28 28, 48 28 C68 28, 74 14, 94 14 C114 14, 120 28, 140 28 C160 28, 166 14, 186 14 C198 14, 208 20, 218 18")' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          from: { strokeDashoffset: '1200' },
          to: { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config

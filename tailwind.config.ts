import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Soft Blue Palette
        primary: {
          DEFAULT: '#839DAB',
          hover: '#657C8B',
          light: '#9CB8C8',
          dark: '#657C8B',
        },
        sage: {
          DEFAULT: '#839DAB',
          light: '#9CB8C8',
          dark: '#657C8B',
        },
        rose: {
          DEFAULT: '#D4A5A5',
          light: '#E5C5C5',
          dark: '#B8938B',
        },
        warm: {
          50: '#F5F1ED',
          100: '#E8E1D9',
          200: '#D4C5B9',
        },
        neutral: {
          DEFAULT: '#2C2C2C',
          medium: '#5A5A5A',
          light: '#8E8E8E',
        },
        focus: '#839DAB',
        success: '#7FCDCD',
        warning: '#E8B86D',
        danger: '#D9A5A0',
        info: '#A5C7D9',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Allura', 'cursive'],
      },
      fontSize: {
        hero: ['64px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        h1: ['48px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }],
        h2: ['36px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['30px', { lineHeight: '1.4', fontWeight: '500' }],
        h4: ['24px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-large': ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        base: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '128': '8rem',
        '80': '5rem',
        '48': '3rem',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      boxShadow: {
        'soft': '0 2px 16px rgba(0, 0, 0, 0.04)',
        'hover': '0 12px 32px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 20px rgba(131, 157, 171, 0.25)',
      },
      maxWidth: {
        container: '1400px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale': 'scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}
export default config


import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: 'rgb(var(--theme-navy-rgb) / <alpha-value>)',
          700: 'rgb(var(--theme-navy-700-rgb) / <alpha-value>)',
          600: 'rgb(var(--theme-navy-600-rgb) / <alpha-value>)',
        },
        royal: 'rgb(var(--theme-royal-rgb) / <alpha-value>)',
        graphite: 'rgb(var(--theme-graphite-rgb) / <alpha-value>)',
        mist: 'rgb(var(--theme-mist-rgb) / <alpha-value>)',
        canvas: 'rgb(var(--theme-canvas-rgb) / <alpha-value>)',
        surface: 'rgb(var(--theme-surface-rgb) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--theme-brand-rgb) / <alpha-value>)',
          dark: 'rgb(var(--theme-brand-dark-rgb) / <alpha-value>)',
        },
        line: 'rgb(var(--theme-line-rgb) / <alpha-value>)',
        ink: 'rgb(var(--theme-ink-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10, 23, 48, 0.03), 0 14px 34px -22px rgba(10, 23, 48, 0.22)',
        hover: '0 4px 12px rgba(10, 23, 48, 0.05), 0 30px 60px -28px rgba(10, 23, 48, 0.34)',
        float: '0 24px 54px -18px rgba(10, 23, 48, 0.38)',
        premium: '0 4px 16px rgba(10, 23, 48, 0.05), 0 34px 80px -34px rgba(10, 23, 48, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;

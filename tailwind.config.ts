import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: 'var(--theme-navy)', 700: 'var(--theme-navy-700)', 600: 'var(--theme-navy-600)' },
        graphite: 'var(--theme-graphite)',
        mist: 'var(--theme-mist)',
        brand: { DEFAULT: 'var(--theme-brand)', dark: 'var(--theme-brand-dark)' },
        line: 'var(--theme-line)',
        ink: 'var(--theme-ink)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(45, 23, 92, 0.03), 0 12px 32px -18px rgba(65, 34, 125, 0.18)',
        hover: '0 4px 10px rgba(45, 23, 92, 0.06), 0 28px 54px -25px rgba(84, 43, 160, 0.32)',
        float: '0 22px 50px -18px rgba(59, 29, 117, 0.38)',
        premium: '0 4px 14px rgba(54, 29, 99, 0.06), 0 30px 70px -30px rgba(72, 36, 140, 0.28)',
      },
    },
  },
  plugins: [],
};

export default config;

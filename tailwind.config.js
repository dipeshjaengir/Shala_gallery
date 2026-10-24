/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gallery-dark': '#0C0C0C',
        'gallery-black': '#050505',
        'warm-white': '#FAF9F6',
        'soft-white': '#F5F5F7',
        
        // Semantic Tokens (driven by CSS variables)
        'theme-bg': 'var(--color-theme-bg)',
        'theme-bg-surface': 'var(--color-theme-bg-surface)',
        'theme-bg-card': 'var(--color-theme-bg-card)',
        'theme-text': 'var(--color-theme-text)',
        'theme-text-muted': 'var(--color-theme-text-muted)',
        'theme-border': 'var(--color-theme-border)',
        'theme-border-medium': 'var(--color-theme-border-medium)',
        'theme-accent': 'var(--color-theme-accent)',
        'accent-yellow-border': '#C5A86E',
      },
      fontFamily: {
        serif: ['"Syncopate"', '"Syne"', '"Tenor Sans"', 'sans-serif'],
        sans: ['"Outfit"', '"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        'widest-editorial': '0.25em',
        'ultra-wide': '0.35em',
      },
    },
  },
  plugins: [],
}

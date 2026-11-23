/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.html', './static/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: { 950: '#070b16', 900: '#0b1120', 800: '#111a2e', 700: '#1c2740' },
        brand: { mark: '#5b6cff', 50: '#eef2ff', 100: '#e0e7ff', 300: '#a5b4fc', 400: '#818cf8', 500: '#4f7cff', 600: '#3b5bdb', 700: '#3245b8' },
        violet: { 500: '#7c4dff' },
      },
      backgroundImage: {
        'grid': 'linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)',
        'brand-gradient': 'linear-gradient(135deg, #4f7cff 0%, #7c4dff 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -15px rgba(79,124,255,0.45)',
      },
    },
  },
  plugins: [],
};

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
        studio: {
          bg: '#fcfcfd',
          surface: '#ffffff',
          card: '#ffffff',
          panel: '#f8f9fa',
          border: '#e4e7ec',
          darkBorder: '#1e293b',
          text: '#0f172a',
          textMuted: '#64748b',
          terracotta: '#c84b31',
          terracottaLight: '#fdf0ec',
          pillDark: '#18181b',
          accentA: '#0284c7',   // Clean Blue/Cyan
          accentB: '#e11d48',   // Crisp Rose/Coral
          accentC: '#7c3aed',   // Crisp Violet
          resultant: '#d97706', // Warm Amber
          success: '#16a34a',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

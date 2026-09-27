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
        schillinger: {
          bg: '#090b10',
          panel: '#10141d',
          card: '#161b26',
          border: '#242d3d',
          borderLight: '#323f54',
          accentA: '#00e5ff',     // Major Generator (Cyan)
          accentB: '#ff5376',     // Minor Generator (Coral / Rose)
          accentC: '#b388ff',     // 3rd Generator (Purple)
          resultant: '#ffb300',   // Resultant r (Amber / Gold)
          counter: '#00e676',     // Countertheme r' (Emerald)
          grid: '#1f2736',
          textMuted: '#8b9bb4',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

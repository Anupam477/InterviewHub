/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        accentBlue: '#3b82f6',
        accentPurple: '#a855f7',
        cardBg: '#1e293b',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vault-red': '#dc2626',
        'vault-red-dark': '#b91c1c',
        'vault-black': '#0a0a0a',
        'vault-gray': '#1a1a1a',
        'vault-gold': '#fbbf24',
      },
      fontFamily: {
        'vault': ['system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        redbull: {
          blue: '#004F93',
          red: '#DC143C',
          yellow: '#FFD700',
          silver: '#C0C0C0'
        }
      }
    },
  },
  plugins: [],
}
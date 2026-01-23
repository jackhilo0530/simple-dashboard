/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // For Vite projects
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        brand: {
          950: '#161950',
          500: '#465fff',
          600: '#3641f5',
          300: '#9cb9ff'
        }
      }
    },
  },
  plugins: [],
}
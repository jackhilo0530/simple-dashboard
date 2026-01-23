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
          500: '#465fff'
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'navbar-text': '#10451d',
        'sec-color': '#f5fff7',
        'main-color': '#155d27',
        'sub-color': '#2dc653',
      },
    },
  },
  
  plugins: [],
}
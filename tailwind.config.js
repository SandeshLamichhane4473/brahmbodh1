/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

       colors: {
        primary: '#ff3d10',
        // secondary: '#01111d '
        secondary: '#1F2937'
      },
    },
  },
  plugins: [],
}
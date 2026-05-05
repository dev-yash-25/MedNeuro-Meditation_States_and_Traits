/** @type {import('tailwindcss').Config} */
module.exports = {

  darkMode: 'class', 
  content: ["./index.html", 
          "./src/**/*.{js,ts,jsx,tsx}"], // This is important!
            safelist: [
    {
      pattern: /(bg|text|border)-(indigo|rose|green|amber|sky)-(50|100|200|300|400|500|700|800|900)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        coralStart: '#f77460',
        coralEnd: '#f16194',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        starling: ['starling', 'serif'],
        fieldwork: ['fieldwork', 'sans-serif'],
        'fieldwork-hum': ['fieldwork-hum', 'sans-serif'],
        palanquin: ['Palanquin', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      
    },
  },
 
  plugins: [],
  
};
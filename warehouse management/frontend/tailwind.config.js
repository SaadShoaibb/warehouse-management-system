/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: 'class',
	theme: {
	  extend: {
		colors: {
		  primary: {
			light: '#6366f1',
			dark: '#4338ca'
		  }
		}
	  },
	},
	plugins: [],
  };
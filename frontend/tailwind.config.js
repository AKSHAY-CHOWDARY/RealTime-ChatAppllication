/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
      boxShadow: {
        'custom': '0px 5px 15px rgba(0, 0, 0, 0.35)',
      },
			colors: {
				primary: "#051622",
				secondary: "#1ba098",
				tertiary: "#deb992",
				fourth: "#f7f4e9",
				hoverColor: "#99ddff",
			},
		},
	},
	plugins: [require("daisyui")],
};

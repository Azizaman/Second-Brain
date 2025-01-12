/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
	  extend: {
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		colors: {
		  sidebar: {
			DEFAULT: "#252A31", // Light gray for background
			foreground: "#111827", // Dark text
			primary: "#2563EB", // Blue for highlights
			"primary-foreground": "#FFFFFF", // White for text on primary
			accent: "#F59E0B", // Yellow for hover or active states
			"accent-foreground": "#111827", // Dark text for accents
			hover: "#E5E7EB", // Lighter gray for hover effect
			border: "#D1D5DB", // Light gray for borders
			ring: "#93C5FD", // Light blue for focus rings
		  },
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  
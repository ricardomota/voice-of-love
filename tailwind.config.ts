import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		fontFamily: {
			'playfair': ['Playfair Display', 'serif'],
			'zilla': ['Zilla Slab', 'serif'],
			'work': ['Work Sans', 'sans-serif'],
			'sans': ['Work Sans', 'sans-serif'],
			'serif': ['Playfair Display', 'serif'],
		},
		container: {
			center: true,
			padding: "1rem",
			screens: {
				"2xl": "1400px",
			},
		},
		screens: {
			'xs': '475px',
			'sm': '640px', 
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
					soft: "hsl(var(--accent-soft))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				love: "hsl(var(--love))",
				memory: "hsl(var(--memory))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in-up": {
					from: { opacity: "0", transform: "translateY(30px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"parallax": {
					from: { transform: "translateY(0px)" },
					to: { transform: "translateY(-10px)" },
				},
				"float": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"shimmer": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" },
				},
				"flow": {
					"0%, 100%": { 
						transform: "translateX(-10px) scale(1)",
						opacity: "0.3"
					},
					"50%": { 
						transform: "translateX(10px) scale(1.05)",
						opacity: "0.7"
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in-up": "fade-in-up 0.6s ease-out forwards",
				"parallax-slow": "parallax 20s ease-in-out infinite alternate",
				"float": "float 6s ease-in-out infinite",
				"shimmer": "shimmer 2s ease-in-out infinite",
				"flow": "flow 3s ease-in-out infinite alternate",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config
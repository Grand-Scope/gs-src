/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				orange: '#FF4D00',
				black: '#000000',
				white: '#FFFFFF',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['"Archivo Black"', 'sans-serif'],
				mono: ['"Space Mono"', 'monospace'],
			},
			animation: {
				'spin-slow': 'spin 12s linear infinite',
				'marquee-left': 'marquee-left 25s linear infinite',
				'marquee-right': 'marquee-right 30s linear infinite',
			},
			keyframes: {
				'marquee-left': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				'marquee-right': {
					'0%': { transform: 'translateX(-50%)' },
					'100%': { transform: 'translateX(0)' },
				},
			},
		},
	},
	plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#E5F2FF',
					100: '#CCE5FF',
					200: '#99CAFF',
					300: '#66B0FF',
					400: '#3396FF',
					500: '#007BFF', // Primary Brand Color
					600: '#0063CC',
					700: '#004A99',
					800: '#003166',
					900: '#001933',
					950: '#001124',
					DEFAULT: '#007BFF',
				},
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

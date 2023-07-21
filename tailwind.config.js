/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs,html}'],
	darkMode: 'class',
	theme: {},
	variants: {},
	daisyui: {
		themes: [
			'light',
			'dark',
			'cupcake',
			'bumblebee',
			'emerald',
			'corporate',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'halloween',
			'garden',
			'forest',
			'aqua',
			'lofi',
			'pastel',
			'fantasy',
			'wireframe',
			'luxury',
			'dracula',
			'cmyk',
			'autumn',
			'business',
			'acid',
			'lemonade',
			'night',
			'coffee',
			'winter',
			{
				black: {
					'color-scheme': 'dark',
					primary: '#343232',
					secondary: '#343232',
					accent: '#343232',
					'base-100': '#000000',
					'base-200': '#0D0D0D',
					'base-300': '#1A1919',
					neutral: '#272626',
					'neutral-focus': '#343232',
					info: '#0000ff',
					success: '#008000',
					warning: '#ffff00',
					error: '#ff0000',
					'--rounded-box': '1rem',
					'--rounded-btn': '0.5rem',
					'--rounded-badge': '1.9rem',
					'--animation-btn': '0.25s',
					'--animation-input': '.2s',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '0.95',
					'--border-btn': '1px',
					'--tab-border': '1px',
					'--tab-radius': '0.5rem',
				},
			},
			{
				vibe: {
					'color-scheme': 'light',
					primary: '#fcb0c7',
					secondary: '#e28258',
					accent: '#f29fad',
					neutral: '#252937',
					'base-100': '#e9e3ed',
					info: '#4280eb',
					success: '#38e0a8',
					warning: '#e7970d',
					error: '#f1483b',
				},
			},
			{
				darklite: {
					'color-scheme': 'dark',
					primary: '#3a2787',
					secondary: '#687cd6',
					accent: '#343232',
					'base-100': '#000000',
					'base-200': '#0D0D0D',
					'base-300': '#1A1919',
					neutral: '#272626',
					'neutral-focus': '#343232',
					info: '#88c1e7',
					success: '#68deca',
					warning: '#c16e10',
					error: '#f02431',
				},
			},
			{
				litelight: {
					primary: '#afb1ed',
					secondary: '#687cd6',
					accent: '#f8ffa3',
					neutral: '#272631',
					'base-100': '#ffffff',
					info: '#378ad7',
					success: '#0f7b45',
					warning: '#a35405',
					error: '#fa7561',
				},
			},
		],
		darkTheme: 'darklite',
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
	},
	plugins: [
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('tailwindcss-animatecss'),
		require('@tailwindcss/typography'),
		require('flowbite-react'),
		require('daisyui'),
	],
};

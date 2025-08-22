
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
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
				xl: '2.5rem',
				'2xl': '3rem',
			},
		screens: {
			'xs': '375px',      // Small phones
			'sm': '640px',      // Regular phones/tablets
			'md': '768px',      // Tablets
			'lg': '1024px',     // Small desktop
			'xl': '1280px',     // Desktop
			'2xl': '1400px',    // Large desktop
			// Mobile specific breakpoints
			'mobile-sm': '320px',  // Very small phones
			'mobile-md': '375px',  // iPhone 8, SE
			'mobile-lg': '414px',  // iPhone Plus
			'mobile-xl': '480px',  // Large phones
		}
		},
		extend: {
			colors: {
				// Новая цветовая палитра
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					dark: 'hsl(var(--primary-dark))',
					light: 'hsl(var(--primary-light))',
					'ultra-light': 'hsl(var(--primary-ultra-light))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					dark: 'hsl(var(--secondary-dark))',
					light: 'hsl(var(--secondary-light))',
					'ultra-light': 'hsl(var(--secondary-ultra-light))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					dark: 'hsl(var(--accent-dark))',
					light: 'hsl(var(--accent-light))',
				},
				background: 'hsl(var(--background))',
				foreground: {
					DEFAULT: 'hsl(var(--foreground))',
					medium: 'hsl(var(--foreground-medium))',
					light: 'hsl(var(--foreground-light))',
					'ultra-light': 'hsl(var(--foreground-ultra-light))',
				},
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					elevated: 'hsl(var(--surface-elevated))',
					glass: 'hsl(var(--surface-glass))',
				},
				border: {
					DEFAULT: 'hsl(var(--border))',
					medium: 'hsl(var(--border-medium))',
					strong: 'hsl(var(--border-strong))',
				},
				// Семантические цвета
				success: {
					DEFAULT: 'hsl(var(--success))',
					light: 'hsl(var(--success-light))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					light: 'hsl(var(--warning-light))',
				},
				error: {
					DEFAULT: 'hsl(var(--error))',
					light: 'hsl(var(--error-light))',
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					light: 'hsl(var(--info-light))',
				},
			},
			fontFamily: {
				sans: ['var(--font-sans)'],
				mono: ['var(--font-mono)'],
			},
			fontSize: {
				xs: 'var(--text-xs)',
				sm: 'var(--text-sm)',
				base: 'var(--text-base)',
				md: 'var(--text-md)',
				lg: 'var(--text-lg)',
				xl: 'var(--text-xl)',
				'2xl': 'var(--text-2xl)',
				'3xl': 'var(--text-3xl)',
				'4xl': 'var(--text-4xl)',
				'5xl': 'var(--text-5xl)',
				'6xl': 'var(--text-6xl)',
			},
			fontWeight: {
				light: 'var(--font-light)',
				normal: 'var(--font-normal)',
				medium: 'var(--font-medium)',
				semibold: 'var(--font-semibold)',
				bold: 'var(--font-bold)',
				extrabold: 'var(--font-extrabold)',
			},
			lineHeight: {
				none: 'var(--leading-none)',
				tight: 'var(--leading-tight)',
				snug: 'var(--leading-snug)',
				normal: 'var(--leading-normal)',
				relaxed: 'var(--leading-relaxed)',
				loose: 'var(--leading-loose)',
			},
			spacing: {
				xs: 'var(--space-xs)',
				sm: 'var(--space-sm)',
				1: 'var(--space-1)',
				1.5: 'var(--space-1-5)',
				2: 'var(--space-2)',
				2.5: 'var(--space-2-5)',
				3: 'var(--space-3)',
				4: 'var(--space-4)',
				5: 'var(--space-5)',
				6: 'var(--space-6)',
				8: 'var(--space-8)',
				10: 'var(--space-10)',
				12: 'var(--space-12)',
				16: 'var(--space-16)',
			},
			borderRadius: {
				xs: 'var(--radius-xs)',
				sm: 'var(--radius-sm)',
				DEFAULT: 'var(--radius-md)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)',
				'2xl': 'var(--radius-2xl)',
				'3xl': 'var(--radius-3xl)',
				full: 'var(--radius-full)',
			},
			boxShadow: {
				xs: 'var(--shadow-xs)',
				sm: 'var(--shadow-sm)',
				DEFAULT: 'var(--shadow-md)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				'glow-primary': 'var(--glow-primary)',
				'glow-secondary': 'var(--glow-secondary)',
				'glow-accent': 'var(--glow-accent)',
			},
			backdropBlur: {
				glass: '12px',
			},
			spacing: {
				'xs': '0.5rem',    // 8px
				'sm': '0.75rem',   // 12px
				'md': '1rem',      // 16px
				'lg': '1.5rem',    // 24px
				'xl': '2rem',      // 32px
				'2xl': '3rem',     // 48px
				'3xl': '4rem',     // 64px
				'section': '4rem', // 64px for section spacing
				'content': '1.5rem', // 24px for content padding
			},
			borderRadius: {
				'xs': '0.125rem',  // 2px
				'sm': '0.25rem',   // 4px
				'md': '0.5rem',    // 8px
				'lg': '0.75rem',   // 12px
				'xl': '1rem',      // 16px
				'2xl': '1.5rem',   // 24px
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
			},
			boxShadow: {
				'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'medium': '0 10px 30px rgba(0, 0, 0, 0.08)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'pulse-slow': 'pulse-slow 3s infinite ease-in-out'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Montserrat', 'sans-serif'],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

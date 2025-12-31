/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luminous Banking Brand Colors
        luminous: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8dcff',
          300: '#79c0ff',
          400: '#389bff',
          500: '#0969da',
          600: '#0550ae',
          700: '#0a3069',
          800: '#0d1d31',
          900: '#010409',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        midnight: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(9, 105, 218, 0.3)',
        'glow-lg': '0 0 40px rgba(9, 105, 218, 0.4)',
        'gold-glow': '0 0 20px rgba(251, 191, 36, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': `
          radial-gradient(at 40% 20%, rgba(9, 105, 218, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(251, 191, 36, 0.08) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(9, 105, 218, 0.08) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(251, 191, 36, 0.05) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(9, 105, 218, 0.1) 0px, transparent 50%)
        `,
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}


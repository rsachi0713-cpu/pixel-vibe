/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
        },
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.5)'
        },
        accent: {
          DEFAULT: '#10B981',
          hover: '#059669',
          glow: 'rgba(16, 185, 129, 0.5)'
        },
        neonPurple: {
          DEFAULT: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.5)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
      }
    },
  },
  plugins: [],
}

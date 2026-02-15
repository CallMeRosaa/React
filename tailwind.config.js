/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070D1B',
        surface: '#0A1025',
        border: '#1E293B',
        step1: '#3B82F6', step2: '#10B981', step3: '#F59E0B', step4: '#8B5CF6',
        step5: '#EC4899', step6: '#EF4444', step7: '#06B6D4', step8: '#84CC16',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
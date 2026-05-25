/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a56db',
        'primary-light': '#e8f0fe',
        accent: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
        surface: '#ffffff',
        'story-bg': '#1e1b4b',
        'story-text': '#e0e7ff',
        muted: '#64748b',
        border: '#e2e8f0',
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 4px 16px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

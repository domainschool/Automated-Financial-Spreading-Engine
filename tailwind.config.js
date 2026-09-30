/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F9F9F8',
          subtle: '#FAF9F6',
          champagne: '#F4EFEA',
          cobalt: '#EDF2F7',
        },
        ink: {
          primary: '#0D0D0D',
          secondary: '#3A3945',
          muted: '#6E6D7A',
          faint: '#9E9DA8',
        },
        glass: {
          surface: 'rgba(255, 255, 255, 0.55)',
          elevated: 'rgba(255, 255, 255, 0.75)',
          dock: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(255, 255, 255, 0.40)',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
      },
      boxShadow: {
        'lucent': '0 20px 50px rgba(20, 20, 30, 0.05)',
        'lucent-hover': '0 24px 60px rgba(20, 20, 30, 0.08)',
        'lucent-glow': '0 12px 36px rgba(99, 102, 241, 0.12)',
        'lucent-emerald': '0 12px 36px rgba(16, 185, 129, 0.14)',
        'lucent-amber': '0 12px 36px rgba(245, 158, 11, 0.14)',
        'lucent-rose': '0 12px 36px rgba(244, 63, 94, 0.14)',
        'floating': '0 30px 60px -12px rgba(15, 23, 42, 0.08), 0 18px 36px -18px rgba(15, 23, 42, 0.04)',
      },
      backdropBlur: {
        '2xl': '40px',
        '3xl': '64px',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#EEF0E9',
          dim: '#E4E7DD',
        },
        ink: {
          DEFAULT: '#12213B',
          2: '#1E3358',
          3: '#2B4270',
        },
        seal: {
          DEFAULT: '#A8783C',
          dark: '#7E5A28',
          light: '#C99A5B',
        },
        maroon: {
          DEFAULT: '#7A2A2E',
          dark: '#5E1F22',
        },
        verified: {
          DEFAULT: '#2F6E5E',
          dark: '#1F4E42',
          bg: '#DEEAE4',
        },
        slate: {
          DEFAULT: '#5B6472',
          light: '#889099',
        },
        line: '#D6D9CD',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 33, 59, 0.06), 0 4px 16px rgba(18, 33, 59, 0.05)',
        lift: '0 8px 30px rgba(18, 33, 59, 0.12)',
        seal: '0 6px 18px rgba(122, 79, 24, 0.35)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(2.2) rotate(-14deg)', opacity: '0' },
          '55%': { transform: 'scale(0.94) rotate(-2deg)', opacity: '1' },
          '75%': { transform: 'scale(1.04) rotate(1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        riseIn: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        stamp: 'stamp 0.6s cubic-bezier(.2,1.4,.4,1) both',
        riseIn: 'riseIn 0.5s ease both',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

const config = {
  content: ['./src/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },
      colors: {
        background: '#fefde7',
        foreground: '#1a1a1a',
        primary: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
        },
      },
      fontFamily: {
        sans: ['var(--font-funnel-sans)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-fields)'],
        quasimoda: ['var(--font-quasimoda)'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--foreground)',
            a: {
              color: 'var(--accent)',
              '&:hover': {
                color: 'var(--accent-hover)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [typography],
  safelist: [
    'bg-gray-500',
    'text-white',
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'text-black',
    'bg-yellow-400',
    'bg-lime-500',
    'bg-green-600',
    'bg-emerald-600',
    'bg-teal-600',
    'bg-cyan-600',
    'bg-sky-600',
    'bg-blue-600',
    'bg-indigo-600',
    'bg-violet-600',
    'bg-purple-600',
    'bg-fuchsia-600',
    'bg-pink-600',
    'bg-rose-600',
  ],
}

export default config

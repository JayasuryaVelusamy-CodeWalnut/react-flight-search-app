import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#667eea',
          DEFAULT: '#5a67d8',
          dark: '#4c51bf',
        },
        secondary: {
          light: '#a3bffa',
          DEFAULT: '#7f9cf5',
          dark: '#667eea',
        },
        accent: {
          light: '#f6ad55',
          DEFAULT: '#ed8936',
          dark: '#dd6b20',
        },
        success: {
          light: '#48bb78',
          DEFAULT: '#38a169',
          dark: '#2f855a',
        },
        danger: {
          light: '#f56565',
          DEFAULT: '#e53e3e',
          dark: '#c53030',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      backdropBlur: {
        'custom': '0.625rem',
      },
    },
  },
  plugins: [],
} satisfies Config
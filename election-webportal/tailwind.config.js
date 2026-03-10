/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        democracy: {
          light: '#F0FDF4',
          DEFAULT: '#10B981', // Democracy Green
          dark: '#059669',
        },
        authority: {
          light: '#FAF5FF',
          DEFAULT: '#9333EA', // Authority Purple
          dark: '#7E22CE',
        },
        navigation: '#3B82F6',
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F9FAF7',
          border: '#E5E7EB',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
        },
        status: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['"Public Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'elevation': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'DEFAULT': '8px',
      }
    },
  },
  plugins: [],
}

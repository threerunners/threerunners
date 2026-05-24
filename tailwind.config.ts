import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f8fb',
          100: '#f1f3f7',
          150: '#ebedf2',
          200: '#e3e6ec',
          300: '#c2c8d2',
          400: '#8b94a3',
          500: '#6b7680',
          600: '#4a5860',
          700: '#2b3a3d',
          800: '#0a3a3f',
          900: '#012a2e',
        },
        brand: {
          50: '#ecfaf2',
          100: '#d4f8e5',
          200: '#9dffc5',
          400: '#4b8a78',
          500: '#012a2e',
          600: '#024147',
          700: '#012a2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        wrap: '1200px',
        narrow: '880px',
        mid: '1080px',
      },
    },
  },
  plugins: [],
};
export default config;

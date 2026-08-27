/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    'grid',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-12',
    'lg:grid-cols-12',
    'md:grid-cols-12',
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
    'col-span-7',
    'col-span-8',
    'col-span-9',
    'col-span-12',
    'lg:col-span-3',
    'lg:col-span-6',
    'lg:col-span-9',
    'lg:col-span-12',
    'xl:col-span-3',
    'xl:col-span-6',
    'hidden',
    'lg:block',
    'lg:hidden',
    'md:hidden',
    'md:block',
    'block',
    'flex',
    'max-w-[1600px]',
    'max-w-7xl',
    'gap-6',
    'gap-8',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Syne', 'Space Grotesk', 'Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Grotesk', 'monospace'],
      },
      colors: {
        slate: {
          950: '#07090e',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Plant/Nature theme colors
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
    },
  },
  plugins: [],
  // ✅ CSS OPTIMIZATION SETTINGS
  // Only process CSS utilities that are actually used in the code
  // This removes ~12-20 KiB of unused Tailwind utilities
  safelist: [
    // Only whitelist dynamic classes if absolutely necessary
    // For this project, all classes should be static (in JSX/HTML)
    // So this array should remain empty for optimal CSS purging
  ],
  // Disable unnecessary Tailwind features not used:
  corePlugins: {
    // Enable all core plugins by default
    // Only disable if you find unused plugins
  },
};

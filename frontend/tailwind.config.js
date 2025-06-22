/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--bg-main)",
        card: "var(--bg-card)",
        textMain: "var(--text-main)",
        textSecondary: "var(--text-secondary)",
        accent: "var(--accent)",
      },
      boxShadow: {
        glow: "var(--glow)",
        card: "var(--shadow)",
      },
      borderRadius: {
        card: "var(--card-radius)",
      },
       extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    },
  }
  },
  plugins: [],
}

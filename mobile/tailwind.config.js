/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        backend: "#0F172A",
        card: "#1E293B",
        accent: "#F59E0B",
        text: "#FFFFFF"
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        autoDark: "#0F172A",
        autoSlate: "#1E293B",
        autoSteel: "#334155",
        autoOrange: "#F97316",
        autoAmber: "#F59E0B",
        autoBlue: "#0EA5E9",
        autoGray: "#E2E8F0"
      }
    }
  },
  plugins: []
};

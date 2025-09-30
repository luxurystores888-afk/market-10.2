import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx,html}",
    "./public/index.html",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        cyberpunk: {
          blue: "#00ffff",
          purple: "#ff00ff", 
          pink: "#ff0080",
          green: "#00ff00"
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
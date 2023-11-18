import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist:[],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

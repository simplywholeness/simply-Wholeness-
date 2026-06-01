import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        linen: "#F7F1EA",
        oat: "#E8DED2",
        clay: "#B77D67",
        olive: "#7C8064",
        ink: "#2F2A26",
        cocoa: "#6C5A4F",
        blush: "#D9A9A0",
        cream: "#FFFDF9"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(54, 44, 36, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;

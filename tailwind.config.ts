import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cloud: {
          50: "#eef7ff",
          100: "#d9ecff",
          500: "#3b82f6",
          700: "#1d4ed8",
          950: "#0f172a"
        }
      }
    }
  },
  plugins: []
};

export default config;

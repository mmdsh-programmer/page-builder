import type { Config } from "tailwindcss";  

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./plugins/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        iranYekan: ["var(--font-iran-yekan)", 'sans-serif'],
        iranSans: ["var(--font-iran-sans)", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

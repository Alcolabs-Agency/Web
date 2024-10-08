import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
<<<<<<< HEAD
      fontFamily:{
        SFbold: ['SF-bold', 'sans-serif'],
        SFregular: ['SF-regular', 'sans-serif'],
        SFmedium: ['SF-medium', 'sans-serif']
      }
=======
      fontFamily: {
        sans: ["sans-serif", "bold", "italic", "medium", "extra-bold", "black", "semi-bold"],
      },
>>>>>>> Yesenia
    },
  },
  plugins: [],
};
export default config;

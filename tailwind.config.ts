import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: ({ colors }) => ({
      black: colors.black,
      error: colors.red,
      info: colors.blue,
      inherit: colors.inherit,
      neutral: colors.gray,
      primary: colors.indigo,
      success: colors.emerald,
      transparent: colors.transparent,
      warning: colors.amber,
      white: colors.white,
    }),
    extend: {
      fontFamily: {
        sans: ["Quicksand", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: ({ colors }) => ({
      black: colors.black,
      blue: colors.blue,
      green: colors.emerald,
      inherit: colors.inherit,
      neutral: colors.gray,
      orange: colors.amber,
      primary: colors.indigo,
      red: colors.red,
      transparent: colors.transparent,
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

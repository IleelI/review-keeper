import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: ({ colors }) => ({
      black: colors.black,
      error: colors.red,
      info: colors.blue,
      inherit: colors.inherit,
      neutral: colors.gray,
      success: colors.emerald,
      transparent: colors.transparent,
      warning: colors.amber,
      white: colors.white,
    }),
    extend: {},
  },
  plugins: [],
} satisfies Config;

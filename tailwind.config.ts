import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: ({ colors }) => ({
      black: colors.black,
      blue: colors.blue,
      current: colors.current,
      green: colors.emerald,
      inherit: colors.inherit,
      neutral: colors.zinc,
      orange: colors.amber,
      primary: colors.indigo,
      red: colors.red,
      transparent: colors.transparent,
      white: colors.white,
    }),
    extend: {
      fontFamily: {
        sans: ["Manrope", ...defaultTheme.fontFamily.sans],
        serif: ["Playfair Display", ...defaultTheme.fontFamily.serif],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      backdropBrightness: {
        85: ".85",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

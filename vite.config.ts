import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import envOnly from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [vercelPreset(), remix(), envOnly(), tsconfigPaths()],
  server: {
    port: 3000,
  },
});

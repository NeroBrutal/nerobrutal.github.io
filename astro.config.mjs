import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Tailwind is wired up via the plain postcss.config.js + tailwind.config.js
// in this project (not @astrojs/tailwind — that integration doesn't yet
// support Astro 7). Astro picks up PostCSS config automatically.
export default defineConfig({
  site: "https://rashidh.com",
  integrations: [react()],
  vite: {
    build: {
      // Dynamic `new URL(..., import.meta.url)` logo lookups (see
      // Work.jsx's getLogo) don't reliably emit assets under the default
      // inline limit — disable inlining so every referenced file ships.
      assetsInlineLimit: 0,
    },
  },
});

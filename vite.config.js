import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "rashidh", // ✅ root path for rashidh.github.io
  build: {
    outDir: "dist", // default
    assetsDir: "assets", // keep assets inside /assets/
  },
});

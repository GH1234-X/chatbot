import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env, // Enables Vite to access env vars (VITE_ only)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),        // From src/
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist", // Vercel expects /dist or /build
    emptyOutDir: true,
  },
});

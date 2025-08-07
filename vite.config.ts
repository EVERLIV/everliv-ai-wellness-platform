
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable content hashing in output filenames
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Add cache busting for all assets
    assetsInlineLimit: 0,
    sourcemap: true,
    // Ensure new file names for each build
    manifest: true
  },
  server: {
    // Set server port to 8080 as required
    port: 8080,
    host: "::",
    // Add headers to prevent caching during development
    headers: {
      'Cache-Control': 'no-store',
    }
  }
}));

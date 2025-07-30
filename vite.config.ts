
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { analyzer } from "vite-bundle-analyzer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'development' ? [componentTagger()] : []),
    ...(process.env.ANALYZE ? [analyzer()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enhanced performance optimizations
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-button', '@radix-ui/react-card'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    sourcemap: mode === 'development',
    manifest: true,
    // Enable compression
    cssCodeSplit: true,
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

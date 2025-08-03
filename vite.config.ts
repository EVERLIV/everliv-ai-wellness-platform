
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { analyzer } from "vite-bundle-analyzer";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'development' ? [componentTagger()] : []),
    ...(process.env.ANALYZE ? [analyzer()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'EVERLIV - Персонализированная медицина',
        short_name: 'EVERLIV',
        description: 'Персонализированная медицина и аналитика здоровья с ИИ',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/dashboard',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'AI Консультация',
            short_name: 'AI Врач',
            description: 'Консультация с AI врачом',
            url: '/dashboard/ai-consultation',
            icons: [{ src: '/favicon.ico', sizes: '48x48' }]
          },
          {
            name: 'Анализы крови',
            short_name: 'Анализы',
            description: 'Загрузить результаты анализов',
            url: '/dashboard/blood-tests',
            icons: [{ src: '/favicon.ico', sizes: '48x48' }]
          }
        ]
      },
      devOptions: {
        enabled: mode === 'development',
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
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
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-slot'],
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

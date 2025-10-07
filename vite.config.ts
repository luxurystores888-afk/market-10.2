// Merged vite.config.ts with obfuscator and all plugins
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import esbuild from 'esbuild';
import obfuscator from 'vite-plugin-javascript-obfuscator';
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true }
    }),
    wasm(),
    topLevelAwait(),
    compression({ level: 9 }),
    obfuscator({
      options: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
      }
    })
  ],
  root: ".",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@api": path.resolve(__dirname, "./api"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  build: {
    outDir: "./dist",
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      external: [],
      output: {
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    minify: 'esbuild'
  },
  publicDir: "./public",
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    hmr: {
      host: "0.0.0.0",
      port: 5000
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
  optimizeDeps: {
    esbuildOptions: { loader: { '.js': 'jsx' } }
  }
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import obfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    obfuscator({
      options: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        // x10^198 strength settings
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
        // Improved chunk splitting strategy
        manualChunks: {
          // Core React - Always needed
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Library - Load when UI components needed  
          'ui-radix': ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar'],
          
          // 3D Graphics - Load only when ShowcasePage is accessed
          'three-js': ['three', '@react-three/fiber', '@react-three/drei'],
          
          // AI Services - Load only when AI features are used
          'ai-providers': ['openai', '@anthropic-ai/sdk', '@google/genai'],
          
          // Animation & Motion - Load when motion components used
          'motion': ['framer-motion'],
          
          // Utils & Helpers
          'utils': ['date-fns', 'clsx', 'tailwind-merge']
        },
        
        // Better file naming for caching
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
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
  optimizeDeps: { include: ['@assemblyscript/loader'] }
});
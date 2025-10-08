import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { compression } from 'vite-plugin-compression2';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

/**
 * 🚀 OPTIMIZED VITE CONFIG
 * 
 * Performance optimizations:
 * - Code splitting
 * - Chunk optimization
 * - Compression
 * - Tree shaking
 * - PWA optimization
 */

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh for better DX
      fastRefresh: true,
      // Babel optimization
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ].filter(Boolean)
      }
    }),
    
    // PWA with offline support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Pulse - E-commerce Platform',
        short_name: 'Pulse',
        description: 'Next-generation e-commerce with zero fees',
        theme_color: '#06b6d4',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Cache strategies
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              }
            }
          }
        ]
      }
    }),
    
    // Gzip & Brotli compression
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024 // Only compress files > 1KB
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024
    }),
    
    // Top-level await support
    topLevelAwait(),
    
    // WASM support
    wasm()
  ],
  
  build: {
    // Target modern browsers for smaller bundle
    target: 'es2020',
    
    // Optimize chunks
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries
          'ui-vendor': ['lucide-react'],
          
          // Charts & visualization (lazy loaded, separate chunk)
          'charts': ['recharts'],
          
          // Three.js (if used, separate chunk)
          'three': ['three'],
          
          // Large dependencies
          'heavy-vendor': ['@xenova/transformers']
        },
        
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Optimize entry names
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    
    // Enable source maps in development only
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : []
      },
      format: {
        comments: false
      }
    },
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000 // KB
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ],
    exclude: [
      // Exclude heavy dependencies from pre-bundling
      '@xenova/transformers',
      'three'
    ]
  },
  
  // Server config
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    // Enable HMR
    hmr: {
      overlay: true
    }
  },
  
  // Preview config
  preview: {
    port: 3000,
    strictPort: true,
    host: true
  }
});

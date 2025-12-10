import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Add bundle visualizer in analyze mode
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Disable source maps in production for smaller bundle
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep config module together to prevent initialization order issues
          if (id.includes('/modules/config/')) {
            return 'config'
          }
          // Don't split PDF library - it's lazy loaded and splitting causes init issues
          // Let it be bundled with the main code or other vendors
          
          // Vendor chunks - process in order of dependency
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor'
          }
          if (id.includes('firebase')) {
            return 'firebase-vendor'
          }
          if (id.includes('@liveblocks')) {
            return 'liveblocks-vendor'
          }
          if (id.includes('codemirror') || id.includes('yjs') || id.includes('y-codemirror') || id.includes('y-protocols')) {
            return 'editor-vendor'
          }
          // PDF library - bundle with editor-vendor to avoid init issues
          if (id.includes('@react-pdf/renderer')) {
            return 'editor-vendor'
          }
        },
      },
    },
    // Enable tree shaking
    minify: 'esbuild',
    // Target modern browsers for smaller bundle
    target: 'esnext',
    // CommonJS options to help with module resolution
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
}))
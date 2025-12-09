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
          // Separate PDF library into its own chunk (lazy loaded)
          if (id.includes('@react-pdf/renderer')) {
            return 'pdf-vendor'
          }
          // Vendor chunks
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor'
          }
          if (id.includes('firebase')) {
            return 'firebase-vendor'
          }
          if (id.includes('@liveblocks')) {
            return 'liveblocks-vendor'
          }
          if (id.includes('codemirror') || id.includes('yjs') || id.includes('y-codemirror')) {
            return 'editor-vendor'
          }
        },
      },
    },
    // Enable tree shaking
    minify: 'esbuild',
    // Target modern browsers for smaller bundle
    target: 'esnext',
  },
}))
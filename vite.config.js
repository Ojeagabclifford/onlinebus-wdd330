import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  base: './', // use relative paths in built files (change to '/your-repo-name/' for GitHub Pages)
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext', // keep if you really need top-level await; otherwise use a lower target and remove top-level await
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  preview: {
    port: 5173,
    open: true
  }
});
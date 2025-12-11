import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: 'public', // expects static files in src/public
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
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
  }});
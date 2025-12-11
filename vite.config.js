import { defineConfig } from 'vite';
import path from 'path'; // path is still needed for path.resolve
import { fileURLToPath, URL } from 'url'; // Import URL utilities for modern path handling

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
      input: {
        // Keeping path.resolve(__dirname, ...) as it forces an absolute path for Rollup,
        // which is often safer and guarantees multi-page app behavior.
        main: path.resolve(__dirname, 'src/index.html'),
        product: path.resolve(__dirname, 'src/product-details/index.html'),
        cart: path.resolve(__dirname, 'src/addItems/index.html')
      }
    }
  },
  resolve: {
    alias: {
      // Using a slightly more modern, URL-based alias resolution
      '@': fileURLToPath(new URL('./src', import.meta.url)) 
      // OR you can keep the original which is also fine: 
      // '@': path.resolve(__dirname, 'src')
    }
  },
  preview: {
    port: 5173,
    open: true
  }
});
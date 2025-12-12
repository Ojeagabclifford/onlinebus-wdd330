// ...existing code...
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',
  base: './',           // <-- make asset/partial URLs relative
  publicDir: 'public',  // <-- ensure public/partials get copied to dist/partials
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        addItems: resolve(__dirname, 'src/additems/index.html'),
        productdetails: resolve(__dirname, 'src/product-details/index.html'),
      },
    },
  },
});
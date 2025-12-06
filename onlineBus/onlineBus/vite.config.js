// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        productListing: resolve(__dirname, 'src/product-listing.html'),
        cart: resolve(__dirname, 'src/cart/index.html'),
        // This is the correct path for individual product pages
        product: resolve(__dirname, 'src/product_pages/index.html'),
        checkout: resolve(__dirname, 'src/checkout/index.html'),
        success: resolve(__dirname, 'src/checkout/success.html'), // bonus – nice to have
      },
    },
  },
});
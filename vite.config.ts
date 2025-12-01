import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [angular()],
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4200
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
});

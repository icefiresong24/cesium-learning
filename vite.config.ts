import { defineConfig, Plugin } from 'vite'
import Cesium from 'vite-plugin-cesium'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
// console.log((import.meta.env ),'meta');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue() ],
  resolve: {
    alias: {
      '@':resolve(__dirname,'src')
    }
  },
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
        // 'cesium':['cesium']
      }
    }
  }
}  
});

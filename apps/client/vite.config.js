import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    },
    extensions: ['.web.tsx', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json']
  },
  build: {
    rollupOptions: {
      external: ['@react-native-google-signin/google-signin']
    }
  },
  server: {
    port: 8081,
    host: true
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  }
});

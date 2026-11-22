import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    },
    extensions: ['.web.jsx', '.web.js', '.jsx', '.js', '.json']
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
    'process.env': {}
  }
});

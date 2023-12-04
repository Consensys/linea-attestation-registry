import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ['./explorer'] })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@verax-attestation-registry/verax-sdk'],
  },
  build: {
    commonjsOptions: {
      include: [/@verax-attestation-registry\/verax-sdk/, /node_modules/],
    },
  },
});

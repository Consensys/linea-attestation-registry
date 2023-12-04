<<<<<<< HEAD:explorer/vite.config.ts
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
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginRadar } from "vite-plugin-radar";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePluginRadar({
      analytics: {
        id: "G-SDPCWGQYK3",
      },
    }),
  ],
>>>>>>> a464ff0bb67bfecb1e815a72d6c269e50b559ffb:website/vite.config.ts
  optimizeDeps: {
    include: ['@verax-attestation-registry/verax-sdk'],
  },
  build: {
    commonjsOptions: {
      include: [/.js$/],
    },
  },
});

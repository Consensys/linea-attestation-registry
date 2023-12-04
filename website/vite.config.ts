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
  optimizeDeps: {
    include: ['@verax-attestation-registry/verax-sdk'],
  },
  build: {
    commonjsOptions: {
      include: [/.js$/],
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginRadar } from "vite-plugin-radar";

// Keep the wallet stack together to avoid Rolldown splitting viem into a runtime cycle.
const web3ChunkPackages = [
  "/@coinbase/",
  "/@reown/",
  "/@safe-global/",
  "/@wagmi/",
  "/@walletconnect/",
  "/ox/",
  "/viem/",
  "/wagmi/",
];

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules") && web3ChunkPackages.some((packageName) => id.includes(packageName))) {
            return "web3";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    VitePluginRadar({
      analytics: {
        id: "G-SDPCWGQYK3",
      },
    }),
  ],
});

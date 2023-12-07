import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ["./explorer"] }), svgr({ include: "**/*.svg" })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["@verax-attestation-registry/verax-sdk"],
  },
  build: {
    commonjsOptions: {
      include: [/@verax-attestation-registry\/verax-sdk/, /node_modules/],
    },
  },
});

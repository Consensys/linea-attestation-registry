import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "es2021",
  external: [
    /^viem/,
    /^@graphprotocol/,
    /^@graphql-mesh/,
    /^@graphql-yoga/,
    /^@whatwg-node/,
    /^axios/,
    /^dotenv/,
    /^graphql/,
    /^ipfs-http-client/,
  ],
  treeshake: true,
  minify: true,
  outDir: "dist",
  bundle: true,
  skipNodeModulesBundle: true,
  shims: true,
  platform: "neutral",
});

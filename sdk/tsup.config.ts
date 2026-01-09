import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      composite: false,
    },
  },
  tsconfig: "tsconfig.build.json",
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "es2021",
  external: [
    /^viem/,
    /^@graphprotocol/,
    /^@graphql-mesh/,
    /^@graphql-yoga/,
    /^@graphql-typed-document-node/,
    /^@whatwg-node/,
    /^axios/,
    /^graphql/,
  ],
  treeshake: true,
  minify: true,
  outDir: "dist",
  bundle: true,
  skipNodeModulesBundle: true,
  shims: true,
  platform: "neutral",
});

/** @type {import("jest").Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ".graphclient/index.ts": ["babel-jest", { configFile: "./babel-jest.config.cjs" }],
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  clearMocks: true,
  resetMocks: true,
  testTimeout: 20000,
  modulePathIgnorePatterns: ["<rootDir>/lib/"],
  moduleNameMapper: {
    "^ipfs-http-client$": "<rootDir>/src/__mocks__/ipfs-http-client.ts",
  },
};

module.exports = config;

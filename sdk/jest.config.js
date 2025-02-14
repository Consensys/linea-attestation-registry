/** @type {import("jest").Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ".graphclient/index.ts": ["babel-jest", { configFile: "./babel-jest.config.cjs" }],
  },
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  moduleNameMapper: {
    "^ipfs-http-client$": "<rootDir>/src/__mocks__/ipfs-http-client.ts",
  },
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  clearMocks: true,
  resetMocks: true,
};

module.exports = config;

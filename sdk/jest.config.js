/** @type {import("jest").Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ".graphclient/index.ts": ["babel-jest", { configFile: "./babel-jest.config.cjs" }],
  },
  coverageReporters: ["lcov", "text", "clover"],
};

module.exports = config;

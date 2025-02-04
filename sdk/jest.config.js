/** @type {import("jest").Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ".graphclient/index.ts": ["babel-jest", { configFile: "./babel-jest.config.cjs" }],
  },
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
};

module.exports = config;

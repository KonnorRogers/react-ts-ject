/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/?!(@harmony)",
  ],
};

import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.js", "tests/integration/**/*.test.js"],
    coverage: {
      provider: "v8",
      exclude: ["dist/vendor/**"],
      include: ["dist/app.js", "dist/lib/**/*.js"],
      reporter: ["text", "lcov", "json-summary"],
      thresholds: { lines: 70, functions: 65, branches: 60, statements: 70 },
    },
  },
});

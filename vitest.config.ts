import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vitest config kept separate from vite.config.ts so the dev-server proxy is not
// pulled into the test run. Tests target the Vuex store (pure TS), but the store
// transitively imports `typeit`, so we run under jsdom to provide document/window.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.spec.ts"],
  },
});

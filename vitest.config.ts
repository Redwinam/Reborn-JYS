import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

// Vitest config kept separate from vite.config.ts so the dev-server proxy is not
// pulled into the test run. Tests run under jsdom to provide document/window
// （store 透传 typeit；组件测试也需要 DOM）。vue() 插件用于编译 .vue 单文件组件，
// 让组件测试（tests/components/**）可以 mount 真实组件。
export default defineConfig({
  plugins: [vue()],
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

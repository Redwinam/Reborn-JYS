import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET?.trim();

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      // Full-stack development uses `vercel dev`; Vite alone serves the SPA.
      // An explicit proxy targets the replacement API and keeps its /api prefix.
      proxy: apiProxyTarget
        ? {
            "/api": {
              target: apiProxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  };
});

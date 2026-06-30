import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // dev 把 /api 代理到线上后端（Vercel serverless functions + Upstash）。线上函数挂在
  // /api/* 路径下，所以这里【不再 strip /api】。旧的 api.jys.wtf（函数在根路径、需 strip）
  // 已退役、部署不存在。需指向别的后端（本地 vercel dev / 预览部署）时设 VITE_API_PROXY_TARGET。
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "https://reborn-jys.vercel.app";

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});

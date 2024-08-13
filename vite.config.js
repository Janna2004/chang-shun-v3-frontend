import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/chang-shun/api": {
        target: "http://1.14.125.238",
        changeOrigin: true,
        rewrite: (path) => {
          console.log("Proxying request:", path);
          return path.replace(/^\/chang-shun\/api/, "/chang-shun/api");
        },
      },
      "/chang-shun": {
        target: "http://1.14.125.238",
        changeOrigin: true,
        rewrite: (path) => {
          console.log("Proxying request:", path);
          return path.replace(/^\/chang-shun/, "/chang-shun");
        },
      },
    },
  },
});

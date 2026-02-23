import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), tailwindcss()],
    preview: {
      allowedHosts: env.VITE_PREVIEW_HOSTS
        ? env.VITE_PREVIEW_HOSTS.split(",")
        : ["localhost"],
    },
    server: {
      allowedHosts: env.VITE_SERVER_HOSTS
        ? env.VITE_SERVER_HOSTS.split(",")
        : ["localhost"],
    },
  };
});

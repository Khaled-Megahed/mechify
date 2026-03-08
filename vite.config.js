import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        // Main landing page
        main: resolve(__dirname, "index.html"),
        // All sub-pages must be listed here
        login: resolve(__dirname, "src/pages/login.html"),
        mechanic: resolve(__dirname, "src/pages/mechanic.html"),
        manager: resolve(__dirname, "src/pages/manager.html"),
      },
    },
  },
});

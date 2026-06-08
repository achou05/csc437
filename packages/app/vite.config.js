import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default {
  build: {
    rollupOptions: {
      input: {
        app: resolve(root, "index.html"),
        login: resolve(root, "login.html")
      }
    }
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/images": "http://localhost:3000"
    }
  }
};

import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "repix",
      fileName: "index",
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: [
        "hono",
        "hono/cors",
        "hono/logger",
        "@hono/node-server",
        "sharp",
        "dotenv",
        "defu",
        "fs",
        "path",
        "url",
      ],
      output: {
        format: "es",
      },
    },
    target: "node18",
    ssr: true,
    minify: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  esbuild: {
    platform: "node",
    target: "node18",
  },
});

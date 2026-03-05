import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const target = "node22";

export default defineConfig({
  ssr: {
    noExternal: ["hono", "@hono/node-server", "dotenv", "defu", "ufo", "evlog"],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "repix",
      fileName: "index",
      formats: ["es"],
    },
    outDir: "dist",
    target,
    ssr: true,
    minify: true,
    rollupOptions: {
      external: ["sharp"], // Native addon - cannot be bundled
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

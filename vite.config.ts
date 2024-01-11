/// <reference types="vitest" />
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "node:path";
// import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // plugins: [tsconfigPaths(), solid()],
  plugins: [solid()],
  test: {
    include: ["test/**/*.test.?(c|m)[jt]s?(x)"],
  },
  resolve: {
    alias: [
      {
        find: "@src",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 1200000,
    rollupOptions: {
      output: {
        manualChunks: {
          p5: ["p5"],
        },
      },
    },
  },
});

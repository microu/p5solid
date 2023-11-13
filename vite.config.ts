/// <reference types="vitest" />
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  test: {
    include: ['test/**/*.test.?(c|m)[jt]s?(x)'],
  },
});

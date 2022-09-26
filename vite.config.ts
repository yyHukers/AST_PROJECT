import { defineConfig } from "vite";
import { resolve } from "path";
import rollupResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";

export default defineConfig({
  build: {
    commonjsOptions: {
      exclude: ["acorn"],
    },
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "MyLib",
      fileName: "my-lib",
      formats: ["es"],
    },
  },
  plugins: [
    rollupResolve(),
    commonjs({
      namedExports: {
        "./lib/main.ts": ["__moduleExports"],
      },
    }),
  ],
});

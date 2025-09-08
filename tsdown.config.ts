import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.tsx",
  format: ["cjs", "esm"],
  dts: true,
  outDir: "dist",
  clean: true,
});

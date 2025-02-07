import { build } from "tsup"

await build({
  entry: ["src/main.ts"],

  format: ["esm"],
  target: "esnext",
  platform: "neutral",

  dts: true,
  sourcemap: true,
  shims: true,
  clean: true,
})

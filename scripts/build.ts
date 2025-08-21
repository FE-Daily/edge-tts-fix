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

await build({
  entry: ["src/cli.ts"],

  format: ["esm"],
  target: "esnext",
  platform: "node",

  dts: false,
  sourcemap: true,
  shims: true,
  clean: false,
})

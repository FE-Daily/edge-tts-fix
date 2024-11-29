import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/main.ts"],

  rollup: {
    cjsBridge: true,
    emitCJS: true,
  },

  declaration: true,
});

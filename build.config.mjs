/**
 * @type {import("unbuild").BuildConfig}
 */
export default {
  clean: true,
  declaration: true,
  entries: [
    {
      input: "./src/index.js"
    },
    {
      input: "./src/utils.js",
    }
  ],
  rollup: {
    esbuild: {
      minify: true,
    },
    output: {
      compact: true,
      format: "esm",
    }
  }
};

/**
 * @type {import("unbuild").BuildConfig}
 */
export default {
  entries: [
    {
      input: "./src/index.js"
    },
    {
      input: "./src/utils.js",
    }
  ],
  declaration: true,
  clean: true,

  rollup: {
    esbuild: {
      minify: true,
    },
    output: {
      format: "esm",
      compact: true,
    }
  }
};

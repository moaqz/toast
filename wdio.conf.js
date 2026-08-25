export const config = {
  bail: 0,
  capabilities: [
    {
      "browserName": "firefox",
      "moz:firefoxOptions": {
        args: ["-headless"]
      }
    },
  ],
  connectionRetryCount: 3,
  connectionRetryTimeout: 120000,
  exclude: [],
  framework: "mocha",
  injectGlobals: false,
  logLevel: "error",
  maxInstances: 1,
  mochaOpts: {
    timeout: 60000,
    ui: "bdd"
  },
  reporters: ["spec"],
  runner: ["browser", {
    coverage: {
      enabled: true
    }
  }],
  specs: ["./test/*.spec.{js,mjs}"],
  waitforTimeout: 10000,
};

export const config = {
  runner: ["browser", {
    coverage: {
      enabled: true
    }
  }],
  specs: ["./test/*.spec.{js,mjs}"],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      "browserName": "firefox",
      "moz:firefoxOptions": {
        args: ["-headless"]
      }
    },
  ],
  logLevel: "error",
  bail: 0,
  waitforTimeout: 10000,
  injectGlobals: false,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000
  },
};

// import { defineConfig } from "cypress";
// require("dotenv").config();

// export default defineConfig({
//   chromeWebSecurity: false,
//   env: {
//     ...import.meta.env,
//   },
//   e2e: {
//     baseUrl: "http://localhost:3000",
//     setupNodeEvents(on, config) {
//     },
//   },
// });

import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    // ...import.meta.env,
    ...process.env,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
    },
  },
});

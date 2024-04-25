import { defineConfig } from "cypress";

/*
module.exports = {
  projectId: "wxnizr",
  // ...rest of the Cypress project config
}
*/

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

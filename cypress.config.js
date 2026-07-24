const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'fukrek',
  defaultCommandTimeout: 20000,
  execTimeout: 20000,
  taskTimeout: 20000,
  pageLoadTimeout: 20000,
  requestTimeout: 20000,
  responseTimeout: 20000,
  e2e: {
    baseUrl: 'http://localhost:8000',
    specPattern: 'cypress/e2e/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      return config
    },
  },
})

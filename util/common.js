/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'
const inStaging = process.env.NODE_ENV === 'staging'
const inE2EMode = process.env.E2E === 'true'

module.exports = {
  inProduction,
  inStaging,
  inE2EMode,
}

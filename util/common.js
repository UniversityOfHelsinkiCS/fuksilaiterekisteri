/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'
const inStaging = process.env.NODE_ENV === 'staging'

module.exports = {
  inProduction,
  inStaging,
}

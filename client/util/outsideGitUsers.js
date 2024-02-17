const users = () => {
  try {
    // eslint-disable-next-line global-require
    return require('../outsideGitFakeUsers.json')
  } catch {
    return []
  }
}
module.exports = users()

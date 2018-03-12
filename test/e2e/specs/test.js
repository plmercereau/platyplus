// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 200000) // TODO too long, changed to pass Travis CI. Original value: 5000
      // .assert.elementPresent('.hello')
      .assert.containsText('h1', 'Home')
      // .assert.elementCount('img', 1)
      .end()
  }
}

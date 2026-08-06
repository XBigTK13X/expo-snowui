const path = require('path')

const root = path.resolve(__dirname, '..')

module.exports = function (api) {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
  }
}
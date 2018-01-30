const path = require('path')
const pkg = require(path.resolve(__dirname, '../package.json'))
const config = require(path.resolve(__dirname, '../.framevuerkrc.json'))
const utils = require(path.resolve(__dirname, './utils.js'))
const HtmlWebpackPlugin = require('html-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = utils.generateConfig(Object.assign(config, {
  name: `${pkg.name}-docs`,
  version: pkg.version,
  entry: utils.resolve('../docs-src/index.js'),
  path: utils.resolve('../docs'),
  minify: process.env.NODE_ENV === 'production',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Framevuerk Documents',
      filename: 'doc.html',
      template: utils.resolve('../docs-src/doc.html')
    })
  ]
}))

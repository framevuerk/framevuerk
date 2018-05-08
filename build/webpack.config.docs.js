const path = require('path')
const pkg = require(path.resolve(__dirname, '../package.json'))
const utils = require(path.resolve(__dirname, './utils.js'))
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const routes = require(utils.resolve('../docs-src/routes.js'))('config')
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const plugins = [new HtmlWebpackPlugin({
  title: 'Framevuerk Documents',
  filename: utils.resolve('../docs/index.html'),
  template: utils.resolve('../docs-src/index.html')
})]
if (process.env.NODE_ENV === 'production') {
  plugins.push(new PrerenderSpaPlugin(
    utils.resolve('../docs'),
    routes.map(route => route.path)
  ))
}
module.exports = utils.generateConfig(Object.assign({
  name: `${pkg.name}-docs`,
  version: pkg.version,
  entry: utils.resolve('../docs-src/index.js'),
  path: utils.resolve('../docs'),
  minify: process.env.NODE_ENV === 'production',
  plugins: plugins
}))

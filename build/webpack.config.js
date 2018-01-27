var path = require('path')
var fs = require('fs')
var pkg = require(path.resolve(__dirname, '../package.json'))
var webpack = require('webpack')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = require(path.resolve(__dirname, '../config.json'))

const utils = require(path.resolve(__dirname, './utils.js'))

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var generateConfig = (cnf, minify = true) => {
  const fileName = `${pkg.name}-${cnf.locale}${(minify ? '.min' : '')}`

  const plugins = [
    new ExtractTextPlugin({
      filename: fileName + '.css'
    }),
    new webpack.DefinePlugin({
      'PKG_NAME': '"' + pkg.name + '"',
      'PKG_VERSION': '"' + pkg.version + '"',
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"',
        config: JSON.stringify(cnf)
      }
    })
  ]

  if (minify) {
    plugins.push(new UglifyJsPlugin())
    plugins.push(new OptimizeCssAssetsPlugin())
  }

  return {
    entry: utils.resolve('../src/index.js'),
    output: {
      path: utils.resolve('../dist'),
      filename: fileName + '.js',
      library: pkg.name,
      libraryTarget: 'umd'
    },
    resolve: {
      alias: {
        locale: utils.resolve(`../locale/${cnf.locale}.js`)
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              js: utils.jsLoader(),
              scss: ExtractTextPlugin.extract(utils.styleLoader(cnf)),
              autoprefixer: true
            }
          }
        },
        {
          test: /\.js$/,
          use: utils.jsLoader(),
          exclude: /node_modules/
        },
        {
          test: /\.(scss|css)$/,
          use: ExtractTextPlugin.extract(utils.styleLoader(cnf))
        }
      ]
    },
    plugins: plugins
  }
}

var ret = []
fs.readdirSync(utils.resolve('../locale')).forEach(file => {
  const locale = require(utils.resolve(`../locale/${file}`))
  const cnf = Object.assign(config, {
    locale: path.basename(file, '.js'),
    direction: locale.direction
  })

  ret.push(generateConfig(cnf, false))
  ret.push(generateConfig(cnf, true))
})

module.exports = ret

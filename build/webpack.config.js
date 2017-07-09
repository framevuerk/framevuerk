var pkg = require('../package.json')
var path = require('path')
var fs = require('fs')
var webpack = require('webpack')

var ENV = process.env.NODE_ENV || 'production'

var generateConfig = (LOCALE, THEME_COLOR) => {
  let DIRECTION
  switch (LOCALE) {
    case 'fa':
      DIRECTION = 'rtl'
      break
    default:
      DIRECTION = 'ltr'
  }
  const CONFIG = {
    ENV,
    LOCALE,
    DIRECTION,
    THEME_COLOR
  }

  const fileName = pkg.name + '-' + CONFIG.LOCALE
  const scssLoader = [
    {
      loader: 'style-loader'
    },
    {
      loader: 'css-loader',
      options: {
        minimize: CONFIG.ENV === 'production'
      }
    },
    {
      loader: 'sass-loader',
      options: {
        data: '' +
          '$env:' + CONFIG.ENV + ';' +
          '$direction:' + CONFIG.DIRECTION + ';' +
          '$theme-color:' + CONFIG.THEME_COLOR + ';' +
          '$locale:' + CONFIG.LOCALE + ';'
      }
    }
  ]

  const plugins = [
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(CONFIG)
    }),
    new webpack.BannerPlugin(
      pkg.name + ' ' + pkg.version + '\n' +
        pkg.description + '\n' +
        'Author: ' + pkg.author + '\n' +
        'Homepage: ' + pkg.homepage + '\n' +
        'CONFIG: ' + JSON.stringify(CONFIG) + '\n'
    ),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
  if (ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }))
  }
  return {
    entry: path.resolve(__dirname, '../src/index.js'),
    stats: { children: false },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: fileName + '.js',
      library: pkg.name,
      libraryTarget: 'umd'
    },
    resolve: {
      alias: {
        locale: path.resolve(__dirname, `../src/locale/${CONFIG.LOCALE}.js`)
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: /node_modules/,
          options: {
            loaders: {
              scss: scssLoader
            }
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: scssLoader
        }
      ]
    },
    plugins: plugins
  }
}

var locales = []
fs.readdirSync(path.resolve(__dirname, '../src/locale')).forEach(file => {
  locales.push(path.basename(file, '.js'))
})

var ret = []
locales.forEach(local => {
  ret.push(generateConfig(local, process.env.THEME_COLOR || '#1f89dd'))
})

module.exports = ret

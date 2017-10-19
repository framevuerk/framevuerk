var path = require('path')
var fs = require('fs')
var pkg = require(path.resolve(__dirname, '../package.json'))
var webpack = require('webpack')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var generateConfig = (LOCALE, THEME_COLOR) => {
  let DIRECTION
  switch (LOCALE) {
  case 'fa':
    DIRECTION = 'rtl'
    break
  default:
    DIRECTION = 'ltr'
  }

  const fileName = pkg.name + '-' + LOCALE

  const plugins = [
    new webpack.DefinePlugin({
      'PKG_NAME': '"' + pkg.name + '"',
      'PKG_VERSION': '"' + pkg.version + '"',
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"',
        LOCALE: '"' + LOCALE + '"',
        DIRECTION: '"' + DIRECTION + '"',
        THEME_COLOR: '"' + THEME_COLOR + '"'
      }
    })
  ]
  if (process.env.NODE_ENV === 'production') {
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
        locale: path.resolve(__dirname, `../src/locale/${LOCALE}.js`)
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: require(path.resolve(__dirname, '../build/.babelrc.json'))
          },
          exclude: /node_modules/
        },
        {
          test: /\.pug$/,
          loader: ['vue-template-compiler-loader', 'pug-html-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                minimize: process.env.NODE_ENV === 'production'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')({
                    browsers: 'last 4 versions'
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                data: '' +
                  '$env:' + process.env.NODE_ENV + ';' +
                  '$direction:' + DIRECTION + ';' +
                  '$theme-color:' + THEME_COLOR + ';' +
                  '$locale:' + LOCALE + ';'
              }
            }
          ]
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

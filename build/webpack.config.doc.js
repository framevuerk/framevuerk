var path = require('path')
var fs = require('fs')
var pkg = require(path.resolve(__dirname,'../package.json'))
var webpack = require('webpack')

var ENV = process.env.NODE_ENV || 'production'

var generateConfig = (LOCALE, THEME_COLOR) => {
  const fileName = 'app'
  const CONFIG = {
    ENV
  }
  const plugins = [
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(CONFIG),
      'PKG_NAME': JSON.stringify(pkg.name),
      'PKG_VERSION': JSON.stringify(pkg.version)
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
  if (CONFIG.ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }))
  }
  return {
    entry: path.resolve(__dirname, '../doc/index.js'),
    stats: { children: false },
    output: {
      path: path.resolve(__dirname, '../public'),
      filename: fileName + '.js',
      library: fileName,
      libraryTarget: 'umd'
    },
    resolve: {
      alias: {
        framevuerk: path.resolve(__dirname, '../', pkg.main)
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
          exclude: /(node_modules|dist)/
        },
        {
          test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|html)/,
          loader: 'file-loader?name=./[name].[ext]'
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
                minimize: CONFIG.ENV === 'production'
              }
            },
            {
              loader: 'sass-loader',
              options: {
                data: '$env:' + CONFIG.ENV + ';'
              }
            }
          ]
        }
      ]
    },
    plugins: plugins
  }
}

module.exports = generateConfig();

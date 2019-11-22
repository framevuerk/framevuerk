const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const WebpackBar = require('webpackbar')
const pkg = require('../package.json')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  mode: null, // dynamic
  output: {
    path: null, // dynamic
    filename: `${pkg.name}.js`,
    library: pkg.name.charAt(0).toUpperCase() + pkg.name.substr(1).toLowerCase(),
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.(scss|css|sass)$/,
        include: [path.resolve(__dirname, '../src')],
        loaders: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-html-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${pkg.name}.css`
    }),
    new VueLoaderPlugin(),
    new WebpackBar({
      name: pkg.name,
      compiledIn: false
    }),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.DefinePlugin({
      'PKG_NAME': JSON.stringify(pkg.name),
      'PKG_VERSION': JSON.stringify(pkg.version),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        name: JSON.stringify(pkg.name),
        version: JSON.stringify(pkg.version),
        direction: JSON.stringify('ltr'),
        blockStart: JSON.stringify('left'),
        blockEnd: JSON.stringify('right'),
        primaryColor: JSON.stringify('red'),
        padding: JSON.stringify('15px')
      }
    }),
  ]
}
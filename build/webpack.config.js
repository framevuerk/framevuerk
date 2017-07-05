var pkg = require('../package.json');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var combineLoaders = require('webpack-combine-loaders');

const CONFIG = {};
CONFIG.NODE_ENV = process.env.NODE_ENV || 'production';
CONFIG.THEME_COLOR = process.env.THEME_COLOR || '#1f89dd';
CONFIG.DIRECTION = process.env.DIRECTION || 'rtl';
CONFIG.LOCALE = process.env.LOCALE || 'fa';

const scssLoader = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {}
  },
  {
    loader: 'sass-loader',
    options: {
      //importer: require('node-sass-importer'),
      data: '\
        $env:'+CONFIG.NODE_ENV+';\
        $direction:'+CONFIG.DIRECTION+';\
        $theme-color:'+CONFIG.THEME_COLOR+';\
        $locale:'+CONFIG.LOCALE+';\
      ',
      outputStyle: 'compressed'
    }
  }
];


module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: pkg.name+'.js',
    library: pkg.name,
    libraryTarget: 'umd'
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
      },
      {
        test: /\.pug$/,
        loader: 'raw-loader!pug-html-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)/,
        loader: 'file-loader?name=./assets/[name].[ext]'
      }
    ]
  },
  plugins: [
    /*new ExtractTextPlugin({
      filename: pkg.name+'.css',
      allChunks: true
    }),*/
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(CONFIG)
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    }),
    new webpack.BannerPlugin(
      pkg.name + ' ' + pkg.version + "\n"+
      pkg.description + "\n" +
      'Author: ' + pkg.author + "\n" +
      'Homepage: ' + pkg.homepage
    )
  ]
}

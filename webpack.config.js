var pkg = require('./package.json');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var combineLoaders = require('webpack-combine-loaders');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: pkg.name+'.js',
    library: pkg.name,
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(p)css$/,
        loader: ExtractTextPlugin.extract( 'css-loader?importLoaders=1&minimize=1!postcss-loader' ),
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        loader: 'raw-loader!pug-html-loader'
      },
      {
        test: /\.htmlz$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)/,
        loader: 'file-loader?name=./assets/[name].[ext]'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: pkg.name+'.css',
      allChunks: true
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

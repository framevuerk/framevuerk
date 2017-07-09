var path = require('path')
var fs = require('fs')
var webpack = require('webpack')

// var ENV = process.env.NODE_ENV || 'production';

var COMPONENTS = []
fs.readdirSync(path.resolve(__dirname, '../src/components')).forEach(file => {
  COMPONENTS.push(path.basename(file, '.vue'))
})

const scssLoader = ['style-loader', 'css-loader', 'sass-loader']
module.exports = {
  entry: path.resolve(__dirname, '../doc/index.js'),
  stats: { children: false },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'app.js',
    library: 'app',
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
        test: /\.pug$/,
        loader: ['file-loader?name=[name].html', 'pug-html-loader']
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(html|png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'COMPONENTS': JSON.stringify(COMPONENTS)
    })
  ]
}

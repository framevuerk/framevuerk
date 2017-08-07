var path = require('path')
var pkg = require(path.resolve(__dirname, '../package.json'))
var webpack = require('webpack')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var generateConfig = () => {
  const fileName = 'app'
  const plugins = [
    new webpack.DefinePlugin({
      'PKG_NAME': '"' + pkg.name + '"',
      'PKG_VERSION': '"' + pkg.version + '"',
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"'
      }
    })
  ]
  return {
    entry: path.resolve(__dirname, '../docs-src/index.js'),
    stats: { children: false },
    output: {
      path: path.resolve(__dirname, '../docs'),
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
          test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|ico|html)/,
          loader: 'file-loader?name=./[name].[ext]'
        },
        {
          test: /\.none$/,
          loader: 'file-loader?name=./[name]'
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
                    browsers: 'last 15 versions'
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                data: '$env:' + process.env.NODE_ENV + ';'
              }
            }
          ]
        }
      ]
    },
    plugins: plugins
  }
}

module.exports = generateConfig()

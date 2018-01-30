const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const lib = {}

lib.resolve = function (dir) {
  return path.resolve(__dirname, dir)
}
lib.styleLoader = function (cnf) {
  const ret = []
  ret.push({
    loader: 'css-loader'
  })
  ret.push({
    loader: 'postcss-loader'
  })

  let sassLoaderData = ''
  Object.keys(cnf).forEach(key => {
    sassLoaderData += `$${key}: ${cnf[key]}; `
  })
  ret.push({
    loader: 'sass-loader',
    options: {
      data: sassLoaderData
    }
  })

  return ret
}

lib.jsLoader = function () {
  return {
    loader: 'babel-loader'
  }
}

lib.generateConfig = (cnf, outputCnf) => {
  const fileName = `${outputCnf.name}${cnf.locale ? `-${cnf.locale}` : ''}${(outputCnf.minify ? '.min' : '')}`

  let plugins = [
    new ExtractTextPlugin({
      filename: fileName + '.css'
    }),
    new webpack.DefinePlugin({
      'PKG_NAME': '"' + outputCnf.name + '"',
      'PKG_VERSION': '"' + outputCnf.version + '"',
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"',
        config: JSON.stringify(cnf)
      }
    })
  ]

  if (outputCnf.minify) {
    plugins.push(new UglifyJsPlugin())
    plugins.push(new OptimizeCssAssetsPlugin())
  }

  if (outputCnf.plugins) {
    plugins = plugins.concat(outputCnf.plugins)
  }

  const ret = {
    entry: outputCnf.entry, // utils.resolve('../src/index.js'),
    output: {
      path: outputCnf.path, // lib.resolve('../dist'),
      filename: fileName + '.js',
      library: outputCnf.name,
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              js: lib.jsLoader(),
              scss: ExtractTextPlugin.extract(lib.styleLoader(cnf)),
              autoprefixer: true
            }
          }
        },
        {
          test: /\.js$/,
          use: lib.jsLoader(),
          exclude: /node_modules/
        },
        {
          test: /\.(scss|css)$/,
          use: ExtractTextPlugin.extract(lib.styleLoader(cnf))
        },
        {
          test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|ico|zhtml)/,
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
        }
      ]
    },
    plugins: plugins
  }

  if (cnf.locale) {
    ret.resolve = {
      alias: {
        locale: lib.resolve(`../locale/${cnf.locale}.js`)
      }
    }
  }
  return ret
}

module.exports = lib

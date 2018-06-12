const path = require('path')
const utility = require(path.resolve(__dirname, '../src/utility'))
const pkg = require(path.resolve(__dirname, '../package.json'))
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
    if (typeof cnf[key] === 'string' && cnf[key].indexOf('/') === -1 && cnf[key].indexOf('\\') === -1) {
      sassLoaderData += `$${key}: ${cnf[key]};`
    }
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
    loader: 'babel-loader',
    options: {
      presets: ['env']
    }
  }
}

lib.generateConfig = (cnf) => {
  const fileName = `${cnf.name}${cnf['config-name'] ? `-${cnf['config-name']}` : ''}${(cnf.minify ? '.min' : '')}`
  let plugins = [
    new ExtractTextPlugin({
      filename: fileName + '.css'
    }),
    new webpack.DefinePlugin({
      'PKG_NAME': '"' + cnf.name + '"',
      'PKG_VERSION': '"' + cnf.version + '"',
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"',
        name: `"${pkg.name}"`,
        version: `"${pkg.version}"`,
        locale: `"${cnf.locale}"`,
        direction: `"${cnf.direction}"`,
        primaryColor: `"${cnf['primary-color']}"`,
        padding: `"${cnf.padding}"`
      }
    })
  ]
  if (cnf.minify) {
    plugins.push(new UglifyJsPlugin())
    plugins.push(new OptimizeCssAssetsPlugin())
  }

  if (cnf.plugins) {
    plugins = plugins.concat(cnf.plugins)
  }

  const ret = {
    entry: cnf.entry,
    output: {
      path: cnf.path,
      filename: fileName + '.js',
      library: utility.capitalizeFirstLetter(pkg.name),
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
          exclude: cnf.name.indexOf('docs') > -1 ? /node_modules/ : /galina_blanka_xx/
        },
        {
          test: /\.(scss|css)$/,
          use: ExtractTextPlugin.extract(lib.styleLoader(cnf))
        },
        {
          test: /\.(png|jpg|gif|woff|woff2|eot|ttf|ico|zhtml)/,
          loader: 'file-loader?name=./[name].[ext]'
        },
        {
          test: /\.(svg)/,
          loader: 'raw-loader'
        },
        {
          test: /\.none$/,
          loader: 'file-loader?name=./[name]'
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

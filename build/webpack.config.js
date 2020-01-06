const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = (config) => {
  const output = {};
  const plugins = [
    new VueLoaderPlugin(),
    // new FriendlyErrorsWebpackPlugin(),
  ];

  if (config.source === 'lib') {
    output.path = path.resolve(__dirname, '../dist');
    output.filename = 'framevuerk.js';
    output.library = 'framevuerk';
    output.libraryTarget = 'umd';
    output.libraryExport = 'default';
  } else {
    output.path = path.resolve(__dirname, '../docs');
    output.filename = 'bundle.js';
    // output.publicPath = path.resolve(__dirname, '../public');
    plugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../docs-src/index.html'),
        filename: path.resolve(__dirname, '../docs/index.html'),
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../static'),
        },
      ]),
    );
  }

  const entry = path.resolve(__dirname, '../', config.source === 'lib' ? 'src/index.js' : 'docs-src/index.js');

  const { mode } = config;

  const resolve = {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@docs': path.resolve(__dirname, '../docs-src'),
    },
  };

  const module = {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.(css)$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  };

  if (config.source === 'docs') {
    resolve.alias.framevuerk = path.resolve(__dirname, '../src/index.js');

    // to generate component.__api
    module.rules.push({
      test: /\.vue$/,
      loader: 'vue-docgen-loader',
      enforce: 'post',
      options: {
        injectAt: '__api',
      },
    });

    // to generate component.__example
    module.rules.push({
      resourceQuery: /blockType=example/,
      loader: path.resolve(__dirname, './utils/example-loader.js'),
    });
  } else {
    module.rules.push({
      resourceQuery: /blockType=example/,
      loader: 'null-loader',
    });
  }

  return {
    entry,
    mode,
    output,
    module,
    resolve,
    plugins,
  };
};

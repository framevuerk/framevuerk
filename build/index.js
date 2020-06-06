const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const cli = require('./utils/cli.js');

const mode = cli.hasArg('-p') ? 'production' : 'development';
const source = cli.getArg('--source');
const watch = cli.hasArg('--watch');

const webpackConfig = require('./webpack.config.js')({
  source,
  mode,
  watch,
});

const compiler = webpack(webpackConfig);

if (watch) {
  if (source === 'lib') {
    cli.write('Watching lib...');
    compiler.watch({
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    }, () => {});
  } else {
    cli.write('Serving docs...');
    const devServer = {
      contentBase: 'docs-src',
      port: 3231,
      host: '0.0.0.0',
      clientLogLevel: 'none',
      liveReload: true,
      quiet: true,
      stats: 'none',
      watchOptions: {
        poll: true,
      },
    };
    new WebpackDevServer(compiler, devServer).listen(devServer.port, () => {});
  }
} else {
  cli.write(`Building ${source}...`);
  compiler.run(() => {
    cli.write('Done!');
  });
}

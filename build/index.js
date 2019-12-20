const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config.js');

const outputPathArgv = process.argv.slice(2).indexOf('-o');
if (outputPathArgv !== -1) {
  config.output.path = path.resolve(process.cwd(), process.argv.slice(2)[outputPathArgv + 1]);
} else {
  config.output.path = path.resolve(__dirname, '../dist');
}


config.mode = process.argv.slice(2).includes('-p') ? 'production' : 'development';

const compiler = webpack(config);

if (process.argv.slice(2).includes('-w')) {
  compiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  }, () => {});
} else {
  compiler.run(() => {});
}

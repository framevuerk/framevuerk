const path = require('path');
const process = require('process');
const cli = require('./utils/cli');
const rollup = require('./rollup');

const { log } = console;

const startApp = async (action) => {
  if (action === 'build') {
    log('Building Lib...');
    await rollup.build();
  } else if (action === 'dev') {
    log('Watching Lib...');
    rollup.watch(({ code }) => log(`[WATCHER] => ${code}`));
  } else if (action === 'dev-to') {
    const defaultOutputFile = '../framevuerk-docs/node_modules/framevuerk/dist/framevuerk.docs.js';
    const outputFile = path.resolve(process.cwd(), (await cli.ask(`Output File Path? [${defaultOutputFile}]`) || defaultOutputFile));
    log('Watching Lib...');
    rollup.watch(outputFile, ({ code }) => log(`[WATCHER] => ${code}`));
  }
};

startApp(cli.getArg('--action'));

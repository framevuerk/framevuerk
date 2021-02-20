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
    const defaultOutputFile = '../framevuerk-docs/src/framevuerk/index.js';
    const userOutputFile = await cli.ask(`Output File Path? [${defaultOutputFile}]`);
    const outputFile = path.resolve(process.cwd(), (userOutputFile || defaultOutputFile));
    log('Watching Lib...', outputFile);
    rollup.watch(outputFile, ({ code }) => log(`[WATCHER] => ${code}`));
  }
};

startApp(cli.getArg('--action'));

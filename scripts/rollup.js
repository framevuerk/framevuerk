const path = require('path');
const process = require('process');
const cli = require('./utils/cli');
const config = require('./config');

const { log } = console;

const startApp = async (action) => {
  if (action === 'build') {
    log('Building Lib...');
    await config.build();
    log('Done!');
    process.exit(0);
  } else if (action === 'dev') {
    let outputFile = await cli.ask('Enter output file:');
    if (outputFile) {
      outputFile = path.resolve(process.cwd(), outputFile);
    } else {
      outputFile = path.resolve(__dirname, '../../framevuerk-docs/node_modules/framevuerk/dist/framevuerk.docs.js');
    }
    log(`Watching Doc Version... (changes will save to "${outputFile}")`);
    await config.watch(outputFile, ({ code }) => log(`[WATCHER] => ${code}`));
  }
};

startApp(cli.getArg('--action'));

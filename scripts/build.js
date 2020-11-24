const cli = require('./utils/cli');
const rollup = require('./rollup');

const { log } = console;

const startApp = async (action) => {
  if (action === 'build') {
    log('Building Lib...');
    await rollup.build();
  } else if (action === 'dev') {
    log('Watching Lib (dev version)...');
    rollup.watch(({ code }) => log(`[WATCHER] => ${code}`));
  }
};

startApp(cli.getArg('--action'));

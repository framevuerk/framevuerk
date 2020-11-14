const path = require('path');
const process = require('process');
const cli = require('./utils/cli');
const config = require('./config');

const startApp = async (action) => {
  switch(action) {
    case 'build':
      console.log('Building Lib...');
      await config.build();
      console.log('Done!');
      process.exit(0);
      break;
    case 'dev':
      let outputFile = await cli.ask('Enter output file:');
      if (outputFile) {
        outputFile = path.resolve(process.cwd(), outputFile);
      } else {
        outputFile = path.resolve(__dirname, '../../framevuerk-docs/node_modules/framevuerk/dist/framevuerk.docs.js');
      }
      console.log(`Watching Doc Version... (changes will save to "${outputFile}")`);
      await config.watch(outputFile, ({ code }) => console.log(`[WATCHER] => ${code}`));
      break;
  }
  
}

startApp(cli.getArg('--action'));
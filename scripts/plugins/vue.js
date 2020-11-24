// eslint-disable-next-line import/no-extraneous-dependencies
const vue = require('rollup-plugin-vue');

module.exports = (includeDocs = false) => vue({
  css: false,
  customBlocks: [
    'template',
    'script',
    // ...(includeDocs ? ['doc', 'example'] : ['!doc', '!example']),
    ...(includeDocs ? ['docs'] : ['!docs']),
    '!*',
  ],
  template: {
    compilerOptions: {
      whitespace: 'condense',
    },
  },
  // beforeAssemble(e) {
  //   console.log(e);
  //   process.exit(0);

  // },
  // compilerParseOptions: {
  //   customBlocks: [
  //     'template',
  //     'script',
  //     ...(includeDocs ? ['doc', 'example'] : ['!doc', '!example']),
  //     '!*',
  //   ],
  // },
});

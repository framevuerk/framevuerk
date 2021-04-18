// eslint-disable-next-line import/no-extraneous-dependencies
const { rollup, watch } = require('rollup');
const pathResolve = require('./utils/pathResolve');
const buble = require('./plugins/buble');
const vue = require('./plugins/vue');
const docs = require('./plugins/docs');
const terser = require('./plugins/terser');

const commonRollupConfig = {
  input: pathResolve('src/index.js'),
  external: ['vue'],
};

const commonPlugins = [
  vue(false),
  buble(),
  terser(),
];

const rollupConfigs = [
  {
    ...commonRollupConfig,
    plugins: commonPlugins,
    output: {
      format: 'esm',
      file: pathResolve('dist/framevuerk.esm.js'),
    },
  },
  {
    ...commonRollupConfig,
    plugins: commonPlugins,
    output: {
      format: 'cjs',
      exports: 'named',
      file: pathResolve('dist/framevuerk.cjs.js'),
    },
  },
  {
    ...commonRollupConfig,
    plugins: commonPlugins,
    output: {
      name: 'Framevuerk',
      exports: 'named',
      globals: {
        vue: 'Vue',
      },
      footer: 'Vue.use(Framevuerk);',
      format: 'iife',
      file: pathResolve('dist/framevuerk.browser.js'),
    },
  },
];

const docVersionRollupConfig = {
  ...commonRollupConfig,
  plugins: [
    docs(),
    vue(true),
    buble(),
    // terser(),
  ],
  output: {
    format: 'esm',
    file: pathResolve('dist/framevuerk.docs.js'),
  },
};

module.exports.build = () => Promise.all(
  [...rollupConfigs, docVersionRollupConfig].map((rollupConfig) => rollup(rollupConfig).then((bundle) => bundle.write(rollupConfig.output))),
);

module.exports.watch = (outputFile, cb = () => {}) => {
  const config = {
    ...docVersionRollupConfig,
    output: {
      ...docVersionRollupConfig.output,
      file: outputFile || docVersionRollupConfig.output.file,
    },
  };
  const watcher = watch(config);
  watcher.on('event', cb);
};

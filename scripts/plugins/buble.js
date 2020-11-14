// const { babel } = require('@rollup/plugin-babel');
const buble = require('@rollup/plugin-buble');

module.exports = () => buble({
  exclude: 'node_modules/**',
  objectAssign: true,
});
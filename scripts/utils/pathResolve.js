const path = require('path');

module.exports = (...dir) => path.resolve(__dirname, '../../', ...dir);
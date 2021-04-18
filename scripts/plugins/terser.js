const { terser } = require('rollup-plugin-terser');

module.exports = () => terser({
  // parse: {
  //   // parse options
  // },
  compress: {
    booleans_as_integers: true,
    ecma: 5,
    passes: 3,
    unsafe_arrows: true,
  },
  // mangle: {
  //     // mangle options

  //     properties: {
  //         // mangle property options
  //     }
  // },
});
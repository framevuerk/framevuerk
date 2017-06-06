module.exports = {
  plugins: [
    require('postcss-smart-import')(),
    require('postcss-for')(),
    require('postcss-each')(),
    require('postcss-apply')(),
    require('postcss-cssnext')(),
    require('postcss-color-yiq')()
  ]
}
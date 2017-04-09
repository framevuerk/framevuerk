module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('postcss-for')({ /* ...options */ }),
    require('postcss-each')({ /* ...options */ }),
    require('postcss-cssnext')({ /* ...options */ }),
    require('postcss-color-yiq')({ /* ...options */ })
  ]
}
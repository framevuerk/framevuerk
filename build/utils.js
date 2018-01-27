const path = require('path')

module.exports.resolve = function (dir) {
  return path.resolve(__dirname, dir)
}
module.exports.styleLoader = function (cnf) {
  const ret = []
  ret.push({
    loader: 'css-loader'
  })
  ret.push({
    loader: 'postcss-loader'
  })

  let sassLoaderData = ''
  Object.keys(cnf).forEach(key => {
    sassLoaderData += `$${key}: ${cnf[key]}; `
  })
  ret.push({
    loader: 'sass-loader',
    options: {
      data: sassLoaderData
    }
  })

  return ret
}

module.exports.jsLoader = function () {
  return {
    loader: 'babel-loader'
  }
}

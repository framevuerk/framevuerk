const path = require('path')
const fs = require('fs')
const pkg = require(path.resolve(__dirname, '../package.json'))
const config = require(path.resolve(__dirname, '../config.json'))
const utils = require(path.resolve(__dirname, './utils.js'))

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const ret = []
fs.readdirSync(utils.resolve('../locale')).forEach(file => {
  const locale = require(utils.resolve(`../locale/${file}`))
  const cnf = Object.assign(config, {
    locale: path.basename(file, '.js'),
    direction: locale.direction
  })
  const outputCnf = {
    name: pkg.name,
    version: pkg.version,
    entry: utils.resolve('../src/index.js'),
    path: utils.resolve('../dist')
  }
  ret.push(utils.generateConfig(cnf, Object.assign(outputCnf, {
    minify: false
  })))
  ret.push(utils.generateConfig(cnf, Object.assign(outputCnf, {
    minify: true
  })))
})

module.exports = ret

const fs = require('fs')
const path = require('path')
const utils = require(path.resolve(__dirname, './utils.js'))
const pkg = require(path.resolve(__dirname, '../package.json'))
const config = require(path.resolve(__dirname, '../.framevuerkrc.json'))
const userConfigPath = path.resolve(__dirname, '../../../.framevuerkrc.json')
const ret = []

if (fs.existsSync(userConfigPath)) {
  let userConfig = require(userConfigPath)
  userConfig = Array.isArray(userConfig) ? userConfig : [userConfig]
  userConfig.forEach(cnf => {
    push(Object.assign(config, cnf))
  })
} else {
  push(config)
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

function push (conf) {
  const cnf = Object.assign(conf, {
    name: pkg.name,
    version: pkg.version,
    entry: utils.resolve('../src/index.js'),
    path: utils.resolve('../dist')
  })

  ret.push(utils.generateConfig(Object.assign(cnf, {
    minify: false
  })))
  ret.push(utils.generateConfig(Object.assign(cnf, {
    minify: true
  })))
}

module.exports = ret

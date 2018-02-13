const fs = require('fs')
const path = require('path')
const utils = require(path.resolve(__dirname, './utils.js'))
const pkg = require(path.resolve(__dirname, '../package.json'))
const config = require(path.resolve(__dirname, '../.framevuerkrc.json'))
const userConfigs = [
  { type: 'file', path: path.resolve(__dirname, '../../../.framevuerkrc') },
  { type: 'js', path: path.resolve(__dirname, '../../../.framevuerkrc.js') },
  { type: 'json', path: path.resolve(__dirname, '../../../.framevuerkrc.json') },
  { type: 'pkg', path: path.resolve(__dirname, '../../../package.json') }
]
const ret = []
push(config)
userConfigs.forEach(userConfig => {
  if (fs.existsSync(userConfig.path)) {
    let userConfigData = {}
    switch (userConfig.type) {
      case 'file':
        userConfigData = JSON.parse(fs.readFileSync(userConfig.path))
        break
      case 'js':
      case 'json':
        userConfigData = require(userConfig.path)
        break
      case 'pkg':
        const userPkg = require(userConfig.path)
        if (userPkg.framevuerk) {
          userConfigData = userPkg.framevuerk
        }
    }
    userConfigData = Array.isArray(userConfigData) ? userConfigData : [userConfigData]
    userConfigData.forEach(cnf => {
      push(Object.assign(config, cnf))
    })
  }
})

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
  if (process.env.NODE_ENV === 'production') {
    ret.push(utils.generateConfig(Object.assign(cnf, {
      minify: true
    })))
  }
}

module.exports = ret

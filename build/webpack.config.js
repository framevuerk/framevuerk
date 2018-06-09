const path = require('path')
const utils = require(path.resolve(__dirname, './utils.js'))
const pkg = require(path.resolve(__dirname, '../package.json'))
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const configs = (() => {
  const cosmiconfig = require('cosmiconfig')
  const explorer = cosmiconfig(pkg.name)
  const searchedFor = explorer.searchSync()
  const defaultConfig = {
    'locale': 'en',
    'direction': 'ltr',
    'primary-color': '#41b883',
    'secondary-color': '#35485d',
    'danger-color': '#dd4b39',
    'warning-color': '#ef8f00',
    'info-color': '#14b0cf',
    'bg-color': '#ffffff',
    'header-bg-color': '#35485d',
    'sidebar-bg-color': '#3a3a3a',
    'padding': '15px',
    'transition-speed': '0.35s',
    'border-radius': '4px',
    'shadow-size': '3px'
  }
  if (searchedFor) {
    let configs = Array.isArray(searchedFor.config) ? searchedFor.config : [searchedFor.config]
    configs = configs.map(config => Object.assign(defaultConfig, config))
    return configs
  }
  return [defaultConfig]
})()

const ret = []
configs.forEach(config => {
  const cnf = Object.assign(config, {
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
})

module.exports = ret

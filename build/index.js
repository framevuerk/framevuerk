#!/usr/bin/env node
process.env.NODE_ENV = 'production'
const webpack = require('webpack')
const config = require('./webpack.config')
const pkg = require('../package.json')

console.log('Framevuerk@' + pkg.version + ' is building...')
webpack(config, () => {
  console.log('Done!')
})

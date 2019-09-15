var path = require('path')
var webpack = require('webpack')
var webpackFn = require('./webpack.config.fn')
var envConfig = require('./env')
var envKeyWord = (process.argv)[2]
var env = envConfig[envKeyWord]
// var publicPath = env.publicPath
var sourcePath, distPath
var webpackConfig

process.env.NODE_ENV = envKeyWord
sourcePath = path.join(__dirname, env.sourcePath)
distPath = path.join(__dirname, env.distPath)

console.info('***current env***', envKeyWord)
console.info('sourcePath: ', sourcePath, 'distPath: ', distPath)

webpackConfig = require('./webpack.config.base')(envKeyWord, env)
webpackConfig['resolve']['alias']['env.cfg'] = webpackFn.getEnvCfg(envKeyWord)
webpackConfig = webpackFn.getOutPutConfig(envKeyWord, env, webpackConfig)
webpackConfig = webpackFn.getOptimizationConfig(envKeyWord, env, webpackConfig)
webpackConfig = webpackFn.getPluginConfig(envKeyWord, webpack, webpackConfig, env)
webpackConfig = webpackFn.getHtmlWebPluginConfig(env, webpackConfig)

module.exports = webpackConfig

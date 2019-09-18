const path = require('path')
const fs = require('fs')
const TerserJSPlugin  = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin   = require('optimize-css-assets-webpack-plugin')
const HtmlWebPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'

module.exports = {
  getEnvCfg: function (envKeyWord) {
    let envCfg, envFilePath

    if (envKeyWord === 'development') {
      envCfg = 'env-development'
    } else if (envKeyWord === 'mock') {
      envCfg = 'env-mock'
    } else if (envKeyWord === 'test') {
      envCfg = 'env-test'
    } else {
      if ((process.argv)[3] && ((process.argv)[3] === 'test' || (process.argv)[4] === 'current-branch')) {
        envCfg = 'env-test'
      } else if ((process.argv)[3] && (process.argv)[3] === 'pre') {
        envCfg = 'env-pre'
      } else {
        envCfg = 'env-production'
      }
    }

    envFilePath = path.join(__dirname, './' + envCfg + '.js')
    return envFilePath
  },

  getOutPutConfig: function (envKeyWord, env, webpackConfig) {
    const appJs = path.resolve(env.sourcePath + '/js/index.js')
    const isDev = envKeyWord === 'development' || envKeyWord === 'mock'

    if (isDev === true) {
      webpackConfig.entry.app = [hotMiddlewareScript, appJs]
      webpackConfig.devtool = 'inline-source-map'
    } else {
      webpackConfig.entry.app = [appJs]
      webpackConfig.devtool = 'cheap-source-map'
    }

    return webpackConfig
  },

  getOptimizationConfig: function (envKeyWord, env, webpackConfig) {
    const isDev = envKeyWord === 'development' || envKeyWord === 'mock'
    let optimization

    if (isDev === true) {
      optimization = {
        namedModules: true,
        namedChunks: true
      }
    } else {
      optimization = {
        minimize: true,
        minimizer: [
          new TerserJSPlugin({
            extractComments: '/@extract/i',
            sourceMap: true
          }), 
          new OptimizeCSSAssetsPlugin()
        ],
        providedExports: true,
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
        noEmitOnErrors: true,
        splitChunks: {
          minSize: 30000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          name: true,
          chunks: 'all',
          cacheGroups: {
            // styles: {
            //   name: 'styles',
            //   test: /\.(scss|css)$/,
            //   chunks: 'all',
            //   enforce: true,
            // },
            vendor: {
              name: 'vendor',
              chunks: 'initial',
              test: /axios/,
              priority: -10
            }
          }
        },
        runtimeChunk: {
          name: 'runtime'
        }
      }
    }

    webpackConfig.optimization = optimization

    return webpackConfig
  },

  getPluginConfig: function (envKeyWord, webpack, webpackConfig, env) {
    var cssPath, cssChunkPath
    const isDev = envKeyWord === 'development' || envKeyWord === 'mock'

    if (isDev === true) {
      cssPath = 'css/[name].css'
      cssChunkPath = 'css/[id].css'
      webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
      )
    } else {
      cssPath = 'css/[name].min.[contenthash:7].css'
      cssChunkPath = 'css/[id].min.[chunkhash:7].css'

      webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin()
      )
    }

    webpackConfig.plugins.push(
      new CopyPlugin([{
        from: path.resolve(env.sourcePath + '/assets'),
        to: path.resolve(env.distPath + '/assets')
      }]),
      
      new MiniCssExtractPlugin({
        filename: cssPath
        // ,chunkFilename: cssChunkPath
      })
    )

    return webpackConfig
  },

  getCssJsFile: function () {
    let css = [] 
    let javascript = []
    try {
      let filePath = path.resolve('./dependencies.json')
      let dep = fs.readFileSync(filePath)
      let depObj = JSON.parse(dep)['dependencies']
      let rawCss = depObj.css
      let rawJavascript = depObj.javascript
      Object.keys(rawCss).forEach(item => {
        if (rawCss[item] && rawCss[item]['dest']) {
          let dest = rawCss[item]['dest']
          dest = dest.replace('<%version%>', rawCss[item]['version'])
          dest = dest.replace('src/', '')
          css.push(dest)
        }
      })
      Object.keys(rawJavascript).forEach(item => {
        if (rawJavascript[item] && rawJavascript[item]['dest']) {
          let dest = rawJavascript[item]['dest']
          dest = dest.replace('<%version%>', rawJavascript[item]['version'])
          dest = dest.replace('src/', '')
          javascript.push(dest)
        }
      })
      return {
        css, javascript
      }
    } catch (err) {
      console.info(err)

      return {
        css, javascript
      }
    }
  },

  getHtmlWebPluginConfig: function (env, webpackConfig) {
    const { css, javascript } = this.getCssJsFile()
    var baseConfig = {
      favicon: '',
      inject: 'body',
      publicPath: env.publicPath,
      libFiles: {
        css: css,
        js: javascript
      }
    }
    webpackConfig.plugins.push(
      new HtmlWebPlugin(Object.assign(baseConfig, {
        title: '我是首页',
        filename: path.resolve(env.distPath + '/app.html'),
        template: path.resolve(env.sourcePath + '/index.ejs'),
        chunks: ['vendor', 'runtime', 'app'],
        inject: 'body',
        needViewPort: false,
        inject: 'body'
      }))
    )

    return webpackConfig
  }
}

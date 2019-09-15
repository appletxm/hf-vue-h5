const path = require('path')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

module.exports = function (envKeyWord, env) {
  const isDev = envKeyWord === 'development' || envKeyWord === 'mock'
  const mode = envKeyWord === 'test' || envKeyWord === 'production' ? 'production' : 'development'

  return {
    mode: mode,
    performance: {
      hints: isDev ? false : 'warning'
    },
    entry: {
      vendor: ['axios']
    },
    output: {
      filename: isDev ? 'js/[name].js' : 'js/[name].min.[chunkhash:7].js',
      path: path.resolve(env.distPath),
      publicPath: env.publicPath,
      pathinfo: isDev
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        },
        
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            context: 'client',
            name: isDev ? '[path][name].[ext]' : 'assets/images/[name].[ext]',
            outputPath: isDev ? '' : 'assets/images/',
            publicPath: isDev ? '../' : '../'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            context: 'client',
            name: isDev ? '[path][name].[ext]' : 'assets/fonts/[name].[hash:7].[ext]',
            outputPath: isDev ? '' : 'assets/fonts/',
            publicPath: isDev ? '../' : '../'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isDev,
                reloadAll: true
              },
            },
            'css-loader', 
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [autoprefixer({ overrideBrowserslist: ['iOS >= 7', 'Android >= 4.1'] })]
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          include: [path.join(__dirname, '..', 'src')]
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          include: [path.join(__dirname, '..', 'src')]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.scss', '.css', '.html', '.json'],
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js',
        'vue': 'vue/dist/vue.min.js',
        '@': path.join(__dirname, '../src/'),
        'env.cfg': '',
        'pages': path.join(__dirname, '../src/js/pages/'),
        'components': path.join(__dirname, '../src/js/components/'),
        'assets': path.join(__dirname, '../src/assets/'),
        'common': path.join(__dirname, '../src/js/common/'),
        'utils': path.join(__dirname, '../src/js/utils/'),
        'store': path.join(__dirname, '../src/js/store')
      }
    },
    plugins: [],
    optimization: {},
    node: {
      buffer: false
    }
  }
}

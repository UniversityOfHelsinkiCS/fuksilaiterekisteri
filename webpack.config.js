const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlTemplate = require('html-webpack-template')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

const { SENTRY_RELEASE, NODE_ENV } = process.env
const sentryRelease = !SENTRY_RELEASE ? 'unknown' : SENTRY_RELEASE

// eslint-disable-next-line
console.log('Build settings:', { sentryRelease, NODE_ENV })


module.exports = (env, argv) => {
  const { mode } = argv
  const additionalPlugins = mode === 'production'
    ? [] // Make JS smaller
    : [new webpack.HotModuleReplacementPlugin()] // Enable hot module replacement

  const additionalOptimizations = mode === 'production'
    ? {
      minimizer: [
        // Make CSS smaller
        new OptimizeCssAssetsPlugin(),
      ],
    }
    : {}

  const additionalEntries = mode === 'production' ? [] : ['webpack-hot-middleware/client?http://localhost:8000']

  const BASE_PATH = process.env.BASE_PATH || '/'
  const { SENTRY_IDENTIFIER, GITHUB_SHA } = process.env

  return {
    mode,
    devtool: 'source-maps',
    output: {
      publicPath: BASE_PATH,
    },
    entry: [
      '@babel/polyfill', // so we don't need to import it anywhere
      './client',
      ...additionalEntries,
    ],
    resolve: {
      alias: {
        Utilities: path.resolve(__dirname, 'client/util/'),
        Components: path.resolve(__dirname, 'client/components/'),
        Assets: path.resolve(__dirname, 'client/assets/'),
        Root: path.resolve(__dirname),
      },
    },
    module: {
      rules: [
        {
          // Load JS files
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          // Load CSS files
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          // Load other files
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: ['file-loader'],
        },
      ],
    },
    optimization: {
      ...additionalOptimizations,
    },
    plugins: [
      // Skip the part where we would make a html template
      new webpack.DefinePlugin({
        'process.env.BASE_PATH': JSON.stringify(BASE_PATH),
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.SENTRY_IDENTIFIER': JSON.stringify(SENTRY_IDENTIFIER),
        'process.env.GITHUB_SHA': JSON.stringify(GITHUB_SHA),
        'process.env.SENTRY_RELEASE': JSON.stringify(sentryRelease),
      }),
      new HtmlWebpackPlugin({
        title: 'Fuksilaite',
        favicon: path.resolve(__dirname, 'client/assets/favicon-32x32.png'),
        inject: false,
        template: htmlTemplate,
        appMountId: 'root',
        headHtmlSnippet: ['<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />'].join('\n'),
      }),
      // Extract css
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name]-[id].css',
      }),
      ...additionalPlugins,
    ],
  }
}

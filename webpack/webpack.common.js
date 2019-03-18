// Import dependencies
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const moment = require('moment');

/**
 * Entry point for the bundle.
 */
const entry = {
  common: path.join(__dirname, '../static/airgg/js/common.js'),
  home: path.join(__dirname, '../static/airgg/js/home.js'),
  member: path.join(__dirname, '../static/airgg/js/member.js'),
  position: path.join(__dirname, '../static/airgg/js/position.js'),
  ranking: path.join(__dirname, '../static/airgg/js/ranking.js'),
  stats: path.join(__dirname, '../static/airgg/js/stats.js'),
  profile: path.join(__dirname, '../static/airgg/js/profile.js'),
};

const now = moment();
const output = {
  path: path.resolve(__dirname, '../static/build'),
  filename: `airgg-[name].${now.format('YYYYMMDD')}.js`,
  publicPath: 'static/build',
};


/**
 * Array of resolve modules entry and file extension to prevent ESLint errors.
 */
const resolve = {
  extensions: ['.ts', '.tsx', '.es6', '.js', '.json', '.svg'],
  alias: {
  },
  modules: [
    path.resolve('static'),
    path.resolve('node_modules'),
  ],
};

/**
 * Default modules loaders.
 */
const modules = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        {
          loader: 'eslint-loader',
        },
      ],
    },
  ],
};

const optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/].*[jt]sx?$/,
        name: 'vendor',
        chunks: 'all',
      },
    },
  },
};

/**
 * Shared plugins.
 *
 * CleanWebpackPlugin()
 * A webpack plugin to remove/clean your build folder(s) before building.
 *
 * ExtractTextPlugin()
 * A webpack plugin to extract text from a bundle, or bundles, into a separate file.
 *
 * HtmlWebpackPlugin()
 * A webpack plugin that simplifies creation of HTML files to serve your webpack bundles.
 */
const plugins = [
  new CleanWebpackPlugin(),
];


/**
 * Webpack configuration.
 */
const WebpackConfig = {
  entry,
  output,
  resolve,
  module: modules,
  optimization,
  plugins,
};

// Export WebpackConfig module
module.exports = WebpackConfig;

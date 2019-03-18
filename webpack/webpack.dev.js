// Import dependencies
const path = require('path');
const merge = require('webpack-merge');
const WebpackCommon = require('./webpack.common');

/**
 * Default dev server settings.
 */
const devServer = {
  contentBase: path.join(__dirname, '../'),
  host: 'localhost',
  port: 3333,
};

/**
 * Webpack configuration.
 */
const WebpackConfig = {
  devServer,
  watch: true,
};

// Check if DEVTOLL is set and add to Webpack configuration
WebpackConfig.devtool = 'inline-source-map'; // Set devtool

// Merge and export WebpackConfig module
module.exports = merge(WebpackCommon, WebpackConfig);

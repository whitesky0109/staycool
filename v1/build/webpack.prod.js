// Import dependencies
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackCommon = require('./webpack.common');

/**
 * Plugins for production build.
 *
 * CopyWebpackPlugin()
 * A webpack plugin that copies individual files or entire directories to the build directory.
 *
 * UglifyJsPlugin()
 * A webpack plugin to minify your JavaScript.
 *
 * LoaderOptionsPlugin()
 * A webpack plugin to edit loader options.
 */
const plugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
];

/**
 * Webpack configuration.
 */
const WebpackConfig = {
  plugins,
};

// Merge and export WebpackConfig module
module.exports = merge(WebpackCommon, WebpackConfig);

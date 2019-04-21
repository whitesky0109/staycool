// Import dependencies
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

/**
 * Entry point for the bundle.
 */
const entry = {
  home: path.join(__dirname, '../src/index.ts'),
};

const output = {
  path: path.resolve(__dirname, '../../static/build'),
  filename: 'airgg-vue.js',
  publicPath: 'static/build',
};


/**
 * Array of resolve modules entry and file extension to prevent ESLint errors.
 */
const resolve = {
  extensions: ['.ts', '.tsx', '.es6', '.js', '.json', '.svg', '.vue'],
  alias: {
    vue$: 'vue/dist/vue.esm.js',
  },
};

/**
 * Default modules loaders.
 */
const modules = {
  rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
          // the "scss" and "sass" values for the lang attribute to the right configs here.
          // other preprocessors should work out of the box, no loader config like this necessary.
          'scss': 'vue-style-loader!css-loader!sass-loader',
          'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
        }
        // other vue-loader options go here
      }
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/],
      },
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(png|jpg|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      loader: 'file-loader',
      options: {
        outputPath: '/assets',
        publicPath: '/static/build/assets',
      },
    },
  ],
};

/*
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
*/

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
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin({
    inject: false,
    filename: `../../templates/v2/home.html`,
    template: `src/template.html`,
  }),
];


/**
 * Webpack configuration.
 */
const WebpackConfig = {
  mode: 'production',
  entry,
  output,
  resolve,
  module: modules,
  // optimization,
  plugins,
};

// Export WebpackConfig module
module.exports = WebpackConfig;

'use strict';

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true
});

var env = process.env.MIX_ENV || 'dev';
var prod = env === 'prod';
var publicPath = 'http://localhost:4001/';

// helpers for writing path names
// e.g. join("web/static") => "/full/disk/path/to/hello/web/static"
function join(dest) { return path.resolve(__dirname, dest); }
function web(dest) { return join('web/static/' + dest); }

var hot = 'webpack-hot-middleware/client?path=' + publicPath + '__webpack_hmr';
var jsEntry = web('js/application.js');
var cssEntry = web('css/application.scss');

var plugins = [
  new ExtractTextPlugin('css/application.css'),
  new webpack.HotModuleReplacementPlugin()
];

if (prod) {
  plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  );
}

var scssConfig = 'css!sass?indentedSyntax&includePaths[]=' + __dirname + '/node_modules';

module.exports = {
  devtool: prod ? null : 'cheap-module-eval-source-map',
  entry: prod ? [jsEntry, cssEntry] : [hot, jsEntry, cssEntry],

  markdownLoader: marked,

  output: {
    path: join('priv/static'),
    filename: 'js/application.js',
    publicPath: publicPath
  },

  resolve: {
    extensions: ['', '.js', '.scss'],
    modulesDirectories: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel!eslint'
      },
      {
        test: /\.scss$/,
        loader: prod ? ExtractTextPlugin.extract('style', scssConfig) : 'style-loader!'+scssConfig
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      { test: /\.md$/, loader: 'html!markdown' }
    ]
  },
  plugins: plugins
};

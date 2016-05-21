/* eslint-env node */
const path = require('path');
const glob = require('glob');

module.exports = {
  context: path.resolve(__dirname),
  entry: glob.sync('./test/**/*.js'),
  output: {
    path: path.resolve(__dirname, '.tmp'),
    filename: 'test.js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.json']
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
};

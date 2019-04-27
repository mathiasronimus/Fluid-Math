const path = require('path');

module.exports = {
  entry: './ts/main/loadEqContainer',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules)|(creator)/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'index.js',
    path: __dirname
  },
  mode: 'production'
};
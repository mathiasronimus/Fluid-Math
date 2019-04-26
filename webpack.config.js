const path = require('path');

module.exports = {
  entry: './ts/main/main',
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
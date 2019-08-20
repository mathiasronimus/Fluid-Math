const path = require('path');

module.exports = {
  entry: {
    "fluid-math": [
      "./src/main/loadEqContainer",
      "./src/layout/VCenterVBox",
      "./src/layout/HBox",
      "./src/layout/HDivider",
      "./src/layout/VDivider",
      "./src/layout/Term",
      "./src/layout/TightHBox",
      './src/layout/RootContainer',
      './src/layout/Radical',
      './src/layout/SubSuper',
      './src/layout/TableContainer',
      './src/layout/Quiz'
    ]
  },
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
    extensions: ['.ts', '.js']
  },
  output: {
    path: __dirname
  },
  mode: 'production'
};
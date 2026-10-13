const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.webpack.js'
  },
  module: {
    rules: [
      {
        test: /\.bpmnlintrc$/i,
        use: 'bpmnlint-loader'
      }
    ]
  },
  devtool: false
};
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './App/App.js',
  output: {
    filename: 'all.js',
    path: path.resolve(__dirname, 'scripts')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  },
  watch: true,
  plugins: [
    // new UglifyJsPlugin()
  ],
};
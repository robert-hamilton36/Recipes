/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  entry: ['./client/index.tsx'],
  output: {
    path: path.join(__dirname, '..', 'server', 'public'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map'
}

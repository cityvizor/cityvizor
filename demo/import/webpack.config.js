const path = require('path');

module.exports = {
  mode: "production",
  entry: './import/worker.ts',
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, '../dist/worker')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};
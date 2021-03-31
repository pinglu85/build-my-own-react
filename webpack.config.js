const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/public/index.html',
      filename: 'index.html',
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};

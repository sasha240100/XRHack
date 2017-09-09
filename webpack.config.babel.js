import path from 'path';
import {argv} from 'yargs';
import webpack from 'webpack';

console.log(argv.host);

export default {
  entry: {
    visual: './src/visual/index.js',
    controller: './src/controller/index.js'
  },

  output: {
    path: path.resolve(__dirname, './app/'),
    filename: 'bundle.[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'window.NET_IP': JSON.stringify(argv.host)
    })
  ],

  devServer: {
    publicPath: '/app'
  }
}

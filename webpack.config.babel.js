import path from 'path';
import {argv} from 'yargs';
import webpack from 'webpack';
import fs from 'fs';

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

  node: {
    fs: 'empty'
  },

  devServer: {
    publicPath: '/app',
    hot: false,
    disableHostCheck: true,
    inline: false,
    https: {
      cert: fs.readFileSync("./server/cert.pem"),
      key: fs.readFileSync("./server/key.pem")
    }
  }
}

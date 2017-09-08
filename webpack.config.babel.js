import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './app/'),
    filename: 'bundle.js'
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

  devServer: {
    publicPath: '/app'
  }
}

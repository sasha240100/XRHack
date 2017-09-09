import path from 'path';

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

  devServer: {
    publicPath: '/app'
  }
}

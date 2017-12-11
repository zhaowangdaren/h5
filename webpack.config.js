const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: ['./vue/app.vue.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve:{
    extensions: ['.vue', '.js', '.css'], //使用的扩展名，解析vue、js等后缀名的文件，在引入时不需填写相应的后缀名了
    alias: {//模块别名列表
      res: path.resolve(__dirname, 'res')
    }
  },
  module: {
    rules:[
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {},
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      title: 'OP.V2',
      filename: 'index.html',
      template: 'index.html'
    })
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8082,
    disableHostCheck: true
  }
}
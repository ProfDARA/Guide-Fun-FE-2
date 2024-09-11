const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

// module.exports berisi object yang berisi konfigurasi webpack
// entry: file yang akan dijadikan sebagai input
// output: file yang akan dijadikan sebagai output
// plugins: plugin yang digunakan dalam project
// module: rules yang digunakan dalam project
module.exports = {
  entry: './src/script.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    /* bisa diisi dengan file html lainnya
    new HtmlWebpackPlugin({
      template: "./src/addNote.html",
      filename: "addNote.html",
    }),*/
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

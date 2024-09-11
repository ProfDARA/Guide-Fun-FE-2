// Webpack development untuk konfigurasi file
const path = require('path');

// merge adalah function yang digunakan untuk menggabungkan konfigurasi webpack
const { merge } = require('webpack-merge');

// common adalah konfigurasi yang digunakan bersamaan dengan konfigurasi development
const common = require('./webpack.common.js');

// module.exports berisi object yang berisi konfigurasi webpack
// mode: mode development
// devServer: konfigurasi server
// static: directory yang akan dijadikan static file
// compress: kompresi file
// port: port yang digunakan
module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
});

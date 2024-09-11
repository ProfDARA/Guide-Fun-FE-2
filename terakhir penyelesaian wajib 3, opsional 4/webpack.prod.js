// ini adalah file konfigurasi webpack untuk mode produksi
// Webpack production untuk konfigurasi file
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
});

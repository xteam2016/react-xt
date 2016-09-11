// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const webpack = require('atool-build/lib/webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(webpackConfig) {
  webpackConfig.output.publicPath = 'http://xtcdn.aiyingta.com/reactxt/'
  webpackConfig.output.path = __dirname+'/dist_prod'
  webpackConfig.babel.plugins.push('transform-runtime');
  webpackConfig.babel.plugins.push(["antd", {
      style: 'css',  // 'less',
      libraryName: 'antd-mobile',
    }]);

  webpackConfig.resolve.modulesDirectories.push(path.join(__dirname,'src'));
  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      $:"jquery",
      jQuery:"jquery",
      "window.jQuery":"jquery"
    })
  );
  webpackConfig.externals = [
    {
      'jquery': 'jQuery'
    }
  ]; 

  // 文件拷贝

  webpackConfig.plugins.push(new CopyWebpackPlugin([{
    from:'./src/static/lib.js',
    to: 'lib.js'
  }]));   
  // Enable this if you have to support IE8.
  // webpackConfig.module.loaders.unshift({
  //   test: /\.jsx?$/,
  //   loader: 'es3ify-loader',
  // });

  webpackConfig.plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json')
  }));

  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.test = /\.dont\.exist\.file/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.test = /\.less$/;
    }
  });

  // Load src/entries/*.js as entry automatically.
  const files = glob.sync('./src/entries/*.js');
  const newEntries = files.reduce(function(memo, file) {
    const name = path.basename(file, '.js');
    memo[name] = file;
    return memo;
  }, {}); 

  webpackConfig.entry = Object.assign({}, webpackConfig.entry, newEntries);

  return webpackConfig;
};

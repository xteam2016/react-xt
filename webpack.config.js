// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const webpack = require('atool-build/lib/webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = function(webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');
  // webpackConfig.devtool = 'cheap-module-source-map';
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

  webpackConfig.plugins.push(new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json')
  }));
  // Enable this if you have to support IE8.
  // webpackConfig.module.loaders.unshift({
  //   test: /\.jsx?$/,
  //   loader: 'es3ify-loader',
  // });

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

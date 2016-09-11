const webpack = require('webpack');

const vendors = [
    "react",
    "react-addons-css-transition-group",
    "react-dom",
    "redux",
    "react-redux",
    "react-router",
    "react-router-redux",
    "react-tap-event-plugin",
    "redux-actions",
    "redux-saga",
    "classnames",
    'classname',
    "history",
    'react-tap-event-plugin'
];

module.exports = {
    output: {
        path: 'src/static/',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
      "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        })
        ,new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
        })
    ]
};
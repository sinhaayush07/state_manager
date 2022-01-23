const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./index.js'],
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'state_manager.js',
    library: 'StateManager',
    publicPath: 'dist'
  },
  node: {
    global: false
 },
 plugins: [
  new webpack.ProvidePlugin({
    global: require.resolve('./global.js')
  })
 ],
  mode: 'production'
};
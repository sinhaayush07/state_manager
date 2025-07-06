const path = require('path');
const webpack = require('webpack');

// CommonJS build configuration
const cjsConfig = {
  entry: './store/store.js',
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'state_manager.cjs.js',
    library: 'StateManager',
    libraryTarget: 'commonjs2',
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

// ES Module build configuration
const esmConfig = {
  entry: './store/store.js',
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'state_manager.esm.js',
    library: 'StateManager',
    libraryTarget: 'commonjs-module',
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

// UMD build configuration (for browser compatibility)
const umdConfig = {
  entry: './store/store.js',
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'state_manager.umd.js',
    library: 'StateManager',
    libraryTarget: 'umd',
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

module.exports = [cjsConfig, esmConfig, umdConfig];
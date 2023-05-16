const { Configuration } = require('webpack');
const path = require('path');
/**
 * @type {Configuration} Webpack Configs Doc
 */
const config = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    filename: 'wujie.js',
    path: path.resolve(__dirname, './lib'),
    // 仅开发库时使用下面的选项
    library: 'Wujie', // 库名
    libraryTarget: 'umd', // 构建为 umd
    umdNamedDefine: true, //  构建 amd 名称
  },
  externals: {
    vue: 'vue',
    wujie: 'wujie',
  },
  mode: 'none', // 采用源码模式打包便于分析
  cache: true,
  module: {
    rules: [
      // 普通 ts-loader babel  1562ms
      // {
      //   test: /\.ts$/,
      //   loader: 'ts-loader',
      // },
      // swc-loader 128ms
      {
        test: /\.ts$/,
        loader: 'swc-loader',
      },
    ],
  },
};

module.exports = config;

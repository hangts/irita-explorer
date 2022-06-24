const path = require('path') //引入path模块
const CompressionPlugin = require('compression-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}
const productionConfig = require('./src/productionConfig.js')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:'http://localhost:3000/',
        secure: false,
        pathRewrite: { '^/api': '' },
      },
      '/lcd': {
        target: productionConfig?.lcdUrl ? productionConfig.lcdUrl:'http://192.168.150.40:1317',
        
        secure: false,
        pathRewrite: { '^/lcd': '' },
      }
    },
  },
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('./src'))
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.output = {
        comments: false
      };
      return args
    })
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/variable.scss";@import "@/style/productization.scss";`,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip', // 使用gzip压缩
        test: /\.js$|\.css$|\.html$/, // 匹配文件名
        filename: '[path][base].gz', // 压缩后的文件名(保持原文件名，后缀加.gz)
        minRatio: 0.8, // 压缩率小于0.8才会压缩
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      })
    ]
  }
}

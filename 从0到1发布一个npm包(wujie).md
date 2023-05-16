# 从0到1发布一个npm包 - 通过 wujie-vue 组件演示





## 涉及的技术栈

- webpack (用于打包除 esm 以外的代码，下面会说到原因)
- vue
- wujie 无界微前端
- **swc** (有希望代替 babel 的 Rust 语言写的新一代编译器，可以利用多核心，快如闪电)



## 需要安装的依赖

```json
{
  "devDependencies": {
    "@swc/cli": "^0.1.62",
    "@swc/core": "^1.3.58",
    "swc-loader": "^0.2.3",
    "ts-loader": "^9.4.2",
    "typescript": "^5.0.4",
    "vue": "^3.3.2",
    "webpack": "^5.82.1",
    "webpack-cli": "^5.1.1"
  },
  "dependencies": {
    "wujie": "^1.0.14"
  }
}
```





## 流程

1. 初始化项目结构

   ```
   |-esm (esm生产代码)
   |-lib (库文件- 普通生产代码)
   |-src
   |   |-index.ts
   |	|-type.ts
   |-index.d.ts
   |-package.json (pnpm init)
   |-webpack.config.js
   |-tsconfig.json (tsc --init)
   ```

   

2. index.ts  - 引入 vue 定义组件 

3. type.ts - 项目相关的类型声明

4.  webpack.config.js 

   ```
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
   ```

    使用 **swc-loader** 128ms 构建完成， 对比 ts-loader 1562ms 显著提速

5.  使用 swc-cli 打包 esm

   - 根目录新建 .swcrc

     ```js
     {
       "$schema": "https://json.schemastore.org/swcrc",
       "jsc": {
         "parser": {
           "syntax": "typescript", // js 使用 ecmascript
           "dynamicImport": false,
           "decorators": false
         },
         "target": "es5",
         "loose": false,
         "externalHelpers": false,
         // Requires v1.2.50 or upper and requires target to be es2016 or upper.
         "keepClassNames": false
       },
       "minify": false // 压缩
     }
     ```

   - 安装 cli

     ```
     pnpm i -D @swc/cli @swc/core
     ```

   - 输出 esm

     ```
     npx swc ./file.js -o output.js
     ```

6. 配置 package.json

7. 发布 npm (如果需要切换 mirror 可以使用 mmp 工具)


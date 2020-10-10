# antd-theme-changer

用于动态修改less变量 实现动态切换antd主题颜色，其他插件支持度待开发。

## 原理: 

使用less.js内置方法 window.less.modifyVars({themeVariables})动态修改less变量色值以改变界面显示颜色

## Install
  - npm install -D antd-theme-changer

```js
const path = require('path');
const antdThemeChanger = require("antd-theme-changer");
const options = {
  stylesDir: path.join(__dirname, './src'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/vars.less'),
  indexFileName: 'index.html',
  generateOnce: false, // generate color.less on each compilation
};
module.exports = (config, { webpack }) => {
  // add plugins
  config.plugins.push(
    new antdThemeChanger(options)
  );
  // do something else
  return config;
};
```

## [MIT](https://github.com/getSpidd/antd-theme-changer.)

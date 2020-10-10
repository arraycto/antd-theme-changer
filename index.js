/**
 * @Description 主题切换
 * @author Spidd
 **/
const { generateTheme } = require('antd-theme-generator');
const { RawSource } = require('webpack-sources');
const path = require('path');

class antdThemeChanger {
  constructor(options) {
    // 默认值
    const defaulOptions = {
      varFile: path.join(__dirname, '../../src/styles/variables.less'),
      antDir: path.join(__dirname, '../../node_modules/antd'),
      stylesDir: path.join(__dirname, '../../src/styles/antd'),
      themeVariables: ['@primary-color'],
      indexFileName: 'index.html',
      generateOnce: false,
      lessUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js',
      publicPath: '',
    };
    this.options = Object.assign(defaulOptions, options);
    this.generated = false;
  }

  init(compilation, callback) {
    const options = this.options;
    // 引入必须css及less拓展
    const less = `
    <link rel="stylesheet/less" type="text/css" href="${options.publicPath}/color.less" />
    <script>
      window.less = {
        async: false,
        env: 'production'
      };
    </script>
    <script type="text/javascript" src="${options.lessUrl}"></script>
        `;
    if (
      options.indexFileName &&
      options.indexFileName in compilation.assets
    ) {
      const index = compilation.assets[options.indexFileName];  // webpack 文件缓存  index.html
      let content = index.source();
      content = content.toString();  // buffer转字符串格式
      if (!content.match(/\/color\.less/g)) {  // 向body中添加less配置
        index.source = () =>
          content.replace(less, '').replace(/<body>/gi, `<body>${less}`);
        content = index.source().toString();
        index.size = () => content.length;
      }
      compilation.assets[options.indexFileName] = new RawSource(content);  // 把修改后的inde.html 文件返回到webpack缓存中
    }
    if (options.generateOnce && this.colors) {
      compilation.assets['color.less'] = {
        source: () => this.colors,
        size: () => this.colors.length
      };
      return callback();
    }
    generateTheme(options)
      .then(css => {
        if (options.generateOnce) {
          this.colors = css;
        }
        compilation.assets['color.less'] = {
          source: () => css,
          size: () => css.length
        };
        callback();
      })
      .catch(err => {
        callback(err);
      });
  }

  apply(compiler) {
    let _this = this;
    // webpack 版本判断
    if (compiler.hooks) {
      compiler.hooks.emit.tapAsync('AntDesignThemePlugin', (compilation, callback) => {
        _this.init(compilation, callback);
      });
    } else {
      compiler.plugin('emit', function(compilation, callback) {
        _this.init(compilation, callback);
      });
    }
  }
}

module.exports = antdThemeChanger;

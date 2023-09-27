# 基础文件

基础文件相当于 `o-book` 启动的脚手架，需要有这层基底才能进行项目的预览和打包。它们与你的 Markdown 网站间接相关，打包后的文件不会包含这些基础文件。如果你不是开发人员，或者不关心脚手架的细节，也可以跳过这章，直接查看[项目文件](./project-docs.md)。

`o-book` 最主要的基础文件有两个，分别是 `sw.js` 和 `_preview.html`。

### sw.js

`sw.js` 是基础文件之一，只有一行代码，内容是引用官方文件进行初始化，不需要过多关注：

```javascript
// sw.js
importScripts(`https://cdn.jsdelivr.net/npm/obook@2.1.15/src/sw/base.js`);
```

### _preview.html

`_preview.html` 是项目启动预览初始化的文件，主要的代码如下：

```html
<!-- 通过 l-m 加载了 book-tool 组件 -->
<l-m src="https://cdn.jsdelivr.net/npm/obook@2.1.0/src/book-tool.html"></l-m>
<!-- 通过 sw 属性引用上面提到的 sw.js 文件，如果 sw.js 更换了命名，这里就需要对应着更换 -->
<book-tool sw="./sw.js">
    <!-- 引用到你的项目配置文件 -->
    <source src="./en/config.json" lang="en" />
    <source src="./cn/config.json" lang="cn" />
</book-tool>
```

其中，`source` 引用地址到**项目配置文件**处，**项目文件**将在下一章讨论。`lang` 属性用于设置文档站默认使用的语言。`obook` 默认支持多语言，如果不需要多语言支持，只保留一个 `source` 即可。

目前 `o-book` 官方支持的语言包括：
- **en** 英语
- **cn** 简体中文
- **t-cn** 繁体中文
- **es** 西班牙语
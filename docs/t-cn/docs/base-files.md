# 基礎文件

基礎文件相當於 `o-book` 啟動的腳手架，需要有這層基底才能進行項目的預覽和打包。它們與你的 Markdown 網站間接相關，打包後的文件不會包含這些基礎文件。如果你不是開發人員，或者不關心腳手架的細節，也可以跳過這章，直接查看[項目文件](./project-docs.md)。

`o-book` 最主要的基礎文件有兩個，分別是 `sw.js` 和 `_preview.html`。

### sw.js

`sw.js` 是基礎文件之一，只有一行代碼，內容是引用官方文件進行初始化，不需要過多關注：

```javascript
// sw.js
importScripts(`https://cdn.jsdelivr.net/npm/obook@2.1.44/src/sw/base.js`);
```

### _preview.html

`_preview.html` 是項目啟動預覽初始化的文件，主要的代碼如下：

```html
<!-- 通過 l-m 加載了 book-tool 組件 -->
<l-m src="https://cdn.jsdelivr.net/npm/obook@2.1.44/src/book-tool.html"></l-m>
<!-- 通過 sw 屬性引用上面提到的 sw.js 文件，如果 sw.js 更換了命名，這裏就需要對應著更換 -->
<book-tool sw="./sw.js">
    <!-- 引用到你的項目配置文件 -->
    <source src="./en/config.json" lang="en" />
    <source src="./cn/config.json" lang="cn" />
</book-tool>
```

其中，`source` 引用地址到**項目配置文件**處，**項目文件**將在下一章討論。`lang` 屬性用於設置文檔站默認使用的語言。`obook` 默認支持多語言，如果不需要多語言支持，只保留一個 `source` 即可。

目前 `o-book` 官方支持的語言包括：
- **en** 英語
- **cn** 簡體中文
- **t-cn** 繁體中文
- **es** 西班牙語
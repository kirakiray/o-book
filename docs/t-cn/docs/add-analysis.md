# 添加分析代碼

如果您需要跟蹤和統計您網站的訪問數據，我們建議您使用 [谷歌分析](https://analytics.google.com)。

要添加分析代碼，請按照以下步驟操作：

1. 使用您的代碼編輯器打開 `_preview.html` 文件。

2. 在 `<book-tool>` 標簽中添加一個帶有 `inject-head` 屬性的 `<template>` 標簽，並將您的統計代碼放置在模板內，類似如下所示：

```html
<book-tool sw="./doc-sw.js">
   <source src="./cn/config.json" lang="cn" />
   <template inject-head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-xxxxxxxxxx"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-xxxxxxxxxx');
        </script>
   </template>
</book-tool>
```

一旦您添加了分析代碼，請重新打包項目。分析代碼會插入到所有頁面的頭部，以便您可以輕松跟蹤和分析您網站的訪問數據。


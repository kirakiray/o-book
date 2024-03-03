# 添加分析代码

如果您需要跟踪和统计您网站的访问数据，我们建议您使用 [谷歌分析](https://analytics.google.com)。

要添加分析代码，请按照以下步骤操作：

1. 使用您的代码编辑器打开 `_preview.html` 文件。

2. 在 `<book-tool>` 标签中添加一个带有 `inject-head` 属性的 `<template>` 标签，并将您的统计代码放置在模板内，类似如下所示：

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

一旦您添加了分析代码，请重新打包项目。分析代码会插入到所有页面的头部，以便您可以轻松跟踪和分析您网站的访问数据。
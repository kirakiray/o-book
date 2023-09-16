# 普通模式

### Markdown 编辑器和静态服务器

我们推荐使用 [VSCode](https://code.visualstudio.com/) 作为你的 Markdown 编辑器。这是微软推出的免费编辑器，提供了简单且免费的扩展支持，其中包括静态服务器扩展。

1. 安装并打开你的 VSCode 软件。
2. 点击左侧的扩展按钮。
3. 搜索一个静态服务器扩展。我们建议使用 [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)。
4. 点击提供的链接进入 "LiveServer" 页面，然后点击 "安装" 按钮，它会自动在你的 VSCode 上安装该插件。

当然，你也可以使用其他的 Markdown 编辑器，比如 Typora，开发工具如 Eclipse，或者甚至是你系统自带的文本编辑器，只要你觉得方便即可。

至于静态服务器，你可以使用本地搭建的服务器，比如 Nginx、Apache 等，只要它能够用来访问静态 HTML 文件就可以。

### 准备初始化文件

初始化文件主要包含三个，其中:
- `index.html` 用于运行 `o-book` 组件预览用的初始化文件；
- `sw.js` o-book 引用的本地初始化文件；
- `config.json` 用来配置文档 markdown 位置的信息

首先新建一个 `index.html` 文件，引用 `o-book` 组件并使用，这个 index.html 的具体内容如下：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>o-book文档预览</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.14/dist/ofa.min.js"></script>
  </head>
  <body>
    <l-m
      src="https://cdn.jsdelivr.net/npm/o-book@2.0.8/src/book-tool.html"
    ></l-m>
    <book-tool sw="./sw.js">
      <source src="./cn/config.json" lang="cn" />
    </book-tool>
  </body>
</html>
```
# 标准模式

标准模式就是使用本地的静态服务器，打开准备好的 `_preview.html` 文件。如果你使用我们推荐的VSCode 编辑器，那么这个步骤非常简单：

1. 打开 [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 扩展页面，点击安装，然后会自动打开VSCode并进行扩展安装。

2. 将下载的项目解压缩，使用 VSCode 打开该文件夹。

3. 在VSCode内，右键根目录下的 `_preview.html` 文件，选择 `open with live server`。等待页面初始化完成后，就能点击页面上的链接进行预览。

`_preview.html` 文件就是预览项目的启动器。你也可以不使用 LiveServer，使用其他能够启动静态服务器的扩展。

这种使用VSCode打开方式的成本最低，编辑器内可以快速启动静态服务器。当然，你也可以使用其他的 Markdown 编辑器，如 Typora，开发工具如 Eclipse，甚至是你系统自带的文本编辑器，只要你觉得方便即可。

至于静态服务器，你可以使用本地搭建的服务器，如 Nginx、Apache 等，只要它能够用来访问静态 HTML 文件就可以。

## 如何打包

同上，在服务器模式下打开 `_preview.html`，点击 `下载网站` 就能得到打包好的静态文件；

接下来，你可以直接进入[基础文件](../base-files.md)章节查看更多信息。

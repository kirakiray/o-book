# 标准模式

标准模式就是用本地的静态服务器打开准备好的 `index.html` 文件；直接享用编辑器的预览模式；如果你用的是我们推荐的VSCode 编辑器，那么这个步骤是非常简单的；

1. 打开 [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 后，点击安装，然后会自动打开VSCode并进行安装该扩展；
2. 将下载的项目解压缩，使用 VSCode 打开该文件夹；
3. 在VSCode内右键根目录下的 `_preview.html` 文件，选择 `open with live server`，等待页面初始化完成后，就能点击页面上链接进行预览;

`_preview.html` 文件就是预览项目的启动器，你可以不使用 LiveServer，改用其他可以启动静态服务器的扩展也是可以的；

这种VSCode打开方式使用成本最低，编辑器内可以快速启动静态服务器；你也可以使用其他的 Markdown 编辑器，比如 Typora，开发工具如 Eclipse，或者甚至是你系统自带的文本编辑器，只要你觉得方便即可。

至于静态服务器，你可以使用本地搭建的服务器，比如 Nginx、Apache 等，只要它能够用来访问静态 HTML 文件就可以。

接下来可以直接进入[基础文件](../file-ready.md)说明章节查看；
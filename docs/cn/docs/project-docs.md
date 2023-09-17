# 项目文件

项目文件是你真正写文档的文件，项目目录结构大致如下：

- **config.json**
- docs
  - **SUMMARY.md**
  - *article1.md*
  - *article2.md*

在这个结构中，`.md` 文件是你实际编写文档内容的文件，你只需要按照 Markdown 的格式编写文档即可。

## config.json 

`config.json` 是文档站的配置文件，用于配置顶部的导航以及其他设置。`navs` 属性用于配置导航栏，其中 `summary` 属性对应下面提到的 `SUMMARY.md` 文件路径。你可以配置多个导航选项。

```json
{
  "navs": [
    {
      "name": "使用文档",
      "summary": "./docs/SUMMARY.md"
    },
    // {
    //   "name": "导航名",
    //   "summary": "./folder/SUMMARY.md"
    // }
  ]
}
```

## SUMMARY.md

SUMMARY.md 的格式是一个简单的链接列表，链接的名字是章节的名字，链接的指向是章节文件的路径，会在文档站的左侧展示。

例如当前文档站的 `SUMMARY.md` 信息如下：

```md
- [介绍](./index.md)
- 启动项目
  - [标准模式](./run-mode/base-mode.md)
  - [命令行模式](./run-mode/cli-mode.md)
  - [网页应用模式](./run-mode/webapp-mode.md)
- [基础文件](./base-files.md)
- [项目文件](./project-docs.md)
```

这些项目文件是构建文档站的关键部分，它们将帮助你组织和展示你的文档内容。请按照以上结构和格式编写你的文档。
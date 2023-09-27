# 添加底部内容

您可以通过编辑 `config.json` 文件中的 `footer` 属性来定义所有页面底部显示的内容。在 `footer` 属性中，指定一个相对路径来引用包含底部内容的 Markdown 文件。

```json
// config.json
{
  ...
  "footer": "./footer.md"
  ...
}
```

与 `SUMMARY.md` 的内容类似，`footer.md` 文件包含了链接列表，每个链接都会在页面的底部显示。以下是一个示例 `footer.md` 文件的内容：

```markdown
<!-- footer.md -->
- <img src="../publics/logo.svg" /> obook
  - ©2023
- 使用文档
  - [介绍](./docs/index.md)
  - [基础文件介绍](./docs/base-files.md)
  - [项目文件介绍](./docs/project-docs.md)
- 关于 ofa.js
  - [ofa.js 官网](https://ofajs.com/)
  - [制作组件](https://ofajs.com/en/cases/simple-component.html)
```

如果您的文档支持多个语言，底部内容也会包括多语言版本的入口链接，以供用户选择。

在 `footer.md` 文件中，您还可以添加图片，它们将显示为底部的图标。这样，您可以轻松为您的文档站添加自定义底部内容。
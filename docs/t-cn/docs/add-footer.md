# 添加底部內容

您可以通過編輯 `config.json` 文件中的 `footer` 屬性來定義所有頁面底部顯示的內容。在 `footer` 屬性中，指定一個相對路徑來引用包含底部內容的 Markdown 文件。

```json
// config.json
{
  ...
  "footer": "./footer.md"
  ...
}
```

與 `SUMMARY.md` 的內容類似，`footer.md` 文件包含了鏈接列表，每個鏈接都會在頁面的底部顯示。以下是一個示例 `footer.md` 文件的內容：

```markdown
<!-- footer.md -->
- <img src="../publics/logo.svg" /> obook
  - ©2023
- 使用文檔
  - [介紹](./docs/index.md)
  - [基礎文件介紹](./docs/base-files.md)
  - [項目文件介紹](./docs/project-docs.md)
- 關於 ofa.js
  - [ofa.js 官網](https://ofajs.com/)
  - [制作組件](https://ofajs.com/en/cases/simple-component.html)
```

在 `footer.md` 文件中，您還可以添加圖片，它們將顯示為底部的圖標。這樣，您可以輕松為您的文檔站添加自定義底部內容。


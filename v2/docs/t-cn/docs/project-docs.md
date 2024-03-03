# 項目文件

項目文件是你真正寫文檔的文件，項目目錄結構大致如下：

- **config.json**
- docs
  - **SUMMARY.md**
  - *article1.md*
  - *article2.md*

在這個結構中，`.md` 文件是你實際編寫文檔內容的文件，你只需要按照 Markdown 的格式編寫文檔即可。

## config.json 

`config.json` 是文檔站的配置文件，用於配置頂部的導航以及其他設置。`navs` 屬性用於配置導航欄，其中 `summary` 屬性對應下面提到的 `SUMMARY.md` 文件路徑。你可以配置多個導航選項。

```json
{
  "navs": [
    {
      "name": "使用文檔",
      "summary": "./docs/SUMMARY.md"
    },
    // {
    //   "name": "導航名",
    //   "summary": "./folder/SUMMARY.md"
    // }
  ]
}
```

## SUMMARY.md

SUMMARY.md 的格式是一個簡單的鏈接列表，鏈接的名字是章節的名字，鏈接的指向是章節文件的路徑，會在文檔站的左側展示。

例如當前文檔站的 `SUMMARY.md` 信息如下：

```md
- [介紹](./index.md)
- 啟動項目
  - [標準模式](./run-mode/base-mode.md)
  - [命令行模式](./run-mode/cli-mode.md)
  - [網頁應用模式](./run-mode/webapp-mode.md)
- [基礎文件](./base-files.md)
- [項目文件](./project-docs.md)
```

這些項目文件是構建文檔站的關鍵部分，它們將幫助你組織和展示你的文檔內容。請按照以上結構和格式編寫你的文檔。
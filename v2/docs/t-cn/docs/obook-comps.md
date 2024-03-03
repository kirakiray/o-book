# 官方組件

obook 官方還提供了許多可直接使用的組件，方便您在文檔中進行展示。

## files-viewer

這個組件用於展示多個文件，可以預覽其中的一個HTML頁面。在組件中，`main`屬性的`<a>`標簽代表首先選中的文件，而`previewer`代表要預覽的HTML文件。您可以參考[ofa.js官網源代碼](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md)中的使用示例：

```html
<files-viewer style="width:100%">
    <a href="../footer.html" preview></a>
    <a href="../en/config.json" main></a>
    <a href="../publics/logo.svg"></a>
</files-viewer>
```

## html-viewer

此組件用於預覽HTML代碼，您可以在其中放置多個代碼塊，最終預覽效果是所有代碼塊按順序拼接在一起。您可以參考[ofa.js官網源代碼](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md)中的使用示例：

```html
<html-viewer>
   <!-- HTML代碼塊 -->
   ...
</html-viewer>
```

## comp-viewer

這是一個專門用於預覽ofa.js組件的組件。您可以在其中指定組件名稱（`comp-name`），然後插入組件代碼塊。您可以參考[ofa.js官網源代碼](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md)中的使用示例：

```html
<comp-viewer comp-name="component-name">
   <!-- 組件代碼塊 -->
   ...
</comp-viewer>
```
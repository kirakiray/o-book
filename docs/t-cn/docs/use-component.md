# 使用組件

由於 obook 基於 [ofa.js](https://ofajs.com/) 開發，因此 obook 文檔支持使用 [ofa.js](https://ofajs.com/) 開發的組件。您可以使用 `l-m` 組件來引用這些自定義組件，並通過像使用 HTML 標簽一樣將其包裹起來。以下是一個使用 [simp-block](https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html) 組件的示例：

```markdown
<l-m src="https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html"></l-m>

<simp-block>

<img src="../publics/logo.svg" class="logo" />

## obook是什麽？

### 如果您只想專注於寫文檔，希望快速創建免費且精美的網站，那麽obook就是您的不二選擇

[使用文檔](./docs/index.md)

</simp-block>
```

## 開發自己的組件

您可以點擊 [制作組件](https://ofajs.com/en/cases/simple-component.html) 來查閱如何開發符合您需求的自定義組件。一旦您開發完成了自己的組件，將其放置在文檔站的根目錄下的 **publics** 目錄下，並使用相對路徑的方式來引用這個組件，以便在文檔中使用。示例如下：

```html
<!-- /publics/my-comp.html -->
<!-- 您開發的自定義組件 -->
<template component>
  ...
</template>
```

```markdown
<!-- /en/index.md -->
<l-m src="../publics/my-comp.html"></l-m>

<my-comp>

...

</my-comp>
```

請注意，自定義組件內的 Markdown 內容將被翻譯成 HTML 元素，例如普通換行段落將被轉換成 `p` 元素，`## `將被翻譯成 `h2` 等。在自定義組件內，您可以通過獲取 slot 內的元素進行初始化和處理。


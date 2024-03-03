# 使用组件

由于 obook 基于 [ofa.js](https://ofajs.com/) 开发，因此 obook 文档支持使用 [ofa.js](https://ofajs.com/) 开发的组件。您可以使用 `l-m` 组件来引用这些自定义组件，并通过像使用 HTML 标签一样将其包裹起来。以下是一个使用 [simp-block](https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html) 组件的示例：

```markdown
<l-m src="https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html"></l-m>

<simp-block>

<img src="../publics/logo.svg" class="logo" />

## obook是什么？

### 如果您只想专注于写文档，希望快速创建免费且精美的网站，那么obook就是您的不二选择

[使用文档](./docs/index.md)

</simp-block>
```

## 开发自己的组件

您可以点击 [制作组件](https://ofajs.com/en/cases/simple-component.html) 来查阅如何开发符合您需求的自定义组件。一旦您开发完成了自己的组件，将其放置在文档站的根目录下的 **publics** 目录下，并使用相对路径的方式来引用这个组件，以便在文档中使用。示例如下：

```html
<!-- /publics/my-comp.html -->
<!-- 您开发的自定义组件 -->
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

请注意，自定义组件内的 Markdown 内容将被翻译成 HTML 元素，例如普通换行段落将被转换成 `p` 元素，`## `将被翻译成 `h2` 等。在自定义组件内，您可以通过获取 slot 内的元素进行初始化和处理。
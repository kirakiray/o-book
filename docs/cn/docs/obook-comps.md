# 官方组件

obook 官方还提供了许多可直接使用的组件，方便您在文档中进行展示。

## files-viewer

这个组件用于展示多个文件，可以预览其中的一个HTML页面。在组件中，`main`属性的`<a>`标签代表首先选中的文件，而`previewer`代表要预览的HTML文件。您可以参考[ofa.js官网源代码](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md)中的使用示例：

```html
<files-viewer style="width:100%">
    <a href="../footer.html" preview></a>
    <a href="../en/config.json" main></a>
    <a href="../publics/logo.svg"></a>
</files-viewer>
```

## html-viewer

此组件用于预览HTML代码，您可以在其中放置多个代码块，最终预览效果是所有代码块按顺序拼接在一起。您可以参考[ofa.js官网源代码](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md)中的使用示例：

```html
<html-viewer>
   <!-- HTML代码块 -->
   ...
</html-viewer>
```

## comp-viewer

这是一个专门用于预览ofa.js组件的组件。您可以在其中指定组件名称（`comp-name`），然后插入组件代码块。您可以参考[ofa.js官网源代码](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md)中的使用示例：

```html
<comp-viewer comp-name="component-name">
   <!-- 组件代码块 -->
   ...
</comp-viewer>
```
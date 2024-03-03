# Official Components

The official obook also provides many ready-to-use components, making it easy for you to present them in your document.

## files-viewer

This component is used to display multiple files and preview one HTML page among them. In the component, the `<a>` tag of the `main` property represents the initially selected file, while `previewer` represents the HTML file to be previewed. You can refer to the usage example in the [ofa.js official website source code](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md):

```html
<files-viewer style="width:100%">
    <a href="../footer.html" preview></a>
    <a href="../en/config.json" main></a>
    <a href="../publics/logo.svg"></a>
</files-viewer>
```

## html-viewer

This component is used to preview HTML code. You can place multiple code blocks in it, and the final preview effect is that all code blocks are concatenated in order. You can refer to the usage example in the [ofa.js official website source code](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md):

```html
<html-viewer>
   <!-- HTML code block -->
   ...
</html-viewer>
```

## comp-viewer

This is a component specifically designed for previewing ofa.js components. You can specify the component name (`comp-name`) and insert a component code block. You can refer to the usage examples in the [ofa.js official website source code](https://github.com/kirakiray/ofa-v4-docs/edit/main/docs/en/index.md).

```html
<comp-viewer comp-name="component-name">
   <!-- Component code block -->
   ...
</comp-viewer>
```
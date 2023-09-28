# Use Components

Since obook is developed based on [ofa.js](https://ofajs.com/), the obook documentation supports the use of components developed with [ofa.js](https://ofajs.com/). You can use the `l-m` component to reference these custom components and wrap them around as if using HTML tags. Here's an example of using the [simp-block](https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html) component:
obook is a simplified Chinese text that describes a tool for creating free and beautiful websites for writing documents. It provides a simplified block and a logo.

Developing your own components

You can click [Create Component](https://ofajs.com/en/cases/simple-component.html) to learn how to develop a custom component that meets your needs. Once you have finished developing your own component, place it in the **publics** directory at the root of the document station, and use a relative path to reference this component for use in the document. An example is as follows:

```html
<!-- /publics/my-comp.html -->
<!-- Your custom component developed -->
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

Please note that the Markdown content inside custom components will be translated into HTML elements. For example, regular line breaks will be converted into `p` elements, and `## ` will be translated into `h2`, and so on. Inside custom components, you can initialize and process elements by accessing the elements inside the slot.


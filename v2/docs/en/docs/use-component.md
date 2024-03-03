# Using Components

Since obook is based on [ofa.js](https://ofajs.com/) development, the obook documentation supports the use of components developed with [ofa.js](https://ofajs.com/). You can use the `l-m` component to reference these custom components and wrap them as if using HTML tags. Here is an example using the [simp-block](https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html) component:

```markdown
<l-m src="https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html"></l-m>

<simp-block>

<img src="../publics/logo.svg" class="logo" />

## What is obook?

### If you only want to focus on writing documents and want to quickly create free and beautiful websites, then obook is your first choice

[Documentation](./docs/index.md)

</simp-block>
```

## Developing Your Own Component

You can click on [Making Components](https://ofajs.com/en/cases/simple-component.html) to learn how to develop custom components that meet your needs. Once you have developed your own component, place it in the **publics** directory under the root directory of the document station, and use relative paths to reference this component for use in the document. An example is shown below:

```html
<!-- /publics/my-comp.html -->
<!-- Your custom component that you developed -->
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

Please note that the Markdown content inside custom components will be translated into HTML elements. For example, regular line breaks will be converted into `p` elements, and `##` will be translated into `h2` elements, etc. Inside custom components, you can initialize and process elements by accessing the elements inside the slot.
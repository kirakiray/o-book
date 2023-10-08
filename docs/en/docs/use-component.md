# Use Components

Since obook is developed based on [ofa.js](https://ofajs.com/), the obook documentation supports the use of components developed with [ofa.js](https://ofajs.com/). You can use the `l-m` component to reference these custom components and wrap them as if they were HTML tags. Here is an example using the [simp-block](https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html) component:

```markdown
<l-m src="https://cdn.jsdelivr.net/npm/obook/blocks/simp-block.html"></l-m>

<simp-block>

<img src="../publics/logo.svg" class="logo" />

## What is obook?

### If you just want to focus on writing documents and want to quickly create free and beautiful websites, then obook is your best choice.

[Documentation](./docs/index.md)

</simp-block>
```

## Developing Your Own Components

You can click [Build components](https://ofajs.com/en/cases/simple-component.html) to see how to develop custom components that meet your needs. Once you have developed your own component, place it in the **publics** directory under the root directory of the documentation station and use relative paths to reference this component for use in the documentation. An example is as follows:

```html
<!-- /publics/my-comp.html -->
<!-- The custom component you developed -->
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

Please note that the Markdown content inside custom components will be translated into HTML elements. For example, regular line breaks will be converted into `p` elements, `## ` will be translated into `h2`, and so on. Inside custom components, you can initialize and process elements by accessing the elements within the slot.
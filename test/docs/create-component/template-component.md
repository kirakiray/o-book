# 模板渲染组件

除了能够使用模板语法，ofa.js 还提供了专用于模板内部的渲染组件，包括条件渲染组件和填充渲染组件。

## 条件渲染组件

### x-if 组件

`x-if` 组件是用来根据条件动态渲染内容的组件。它接受一个 `value` 属性，根据该属性的值来判断是否渲染其子元素。如果 `value` 为 `true`，则渲染子元素，否则不渲染。

以下是一个使用 `x-if` 的示例，用于根据条件渲染不同的内容：

```html
<div id="condition-container">
  <x-if :value="showContent">
    <div>I am rendered because showContent is true.</div>
  </x-if>
</div>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  showContent: true,
};
```

### x-else 组件

`x-if` 可以与 `x-else` 配合使用，实现条件切换渲染。

以下是一个使用 `x-if` 和 `x-else` 的示例，根据不同的条件切换渲染的内容：

```html
<div id="condition-container">
  <x-if :value="showContent">
    <div>I am rendered because showContent is true.</div>
  </x-if>
  <x-else>
    <div>I am rendered because showContent is false.</div>
  </x-else>
</div>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  showContent: false,
};
```

### x-if + x-else-if + x-else 组件

`x-if` 还可以与 `x-else-if` 和 `x-else` 组合使用，实现多条件的渲染。

以下是一个使用 `x-if`、`x-else-if` 和 `x-else` 的示例，根据多个条件切换渲染的内容：

```html
<div id="condition-container">
  <x-if :value="condition === 'A'">
    <div>I am rendered for condition A.</div>
  </x-if>
  <x-else-if :value="condition === 'B'">
    <div>I am rendered for condition B.</div>
  </x-else-if>
  <x-else>
    <div>I am rendered for other conditions.</div>
  </x-else>
</div>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  condition: 'B',
};
```

在上述示例中，根据 `condition` 的不同值，会渲染不同的内容，实现了多条件切换渲染的效果。

## 模板组件之：x-fill 

`x-fill` 组件允许你在模板中动态填充内容，可以根据宿主组件的属性值来生成不同的内容。`x-fill` 组件使用 `name` 属性来指定要使用的填充模板，并通过 `value` 属性传递数据给填充模板。

### x-fill 填充数组字符串的示例

以下是一个使用 `x-fill` 填充数组字符串的示例，通过循环填充不同的字符串内容：

```html
<div id="fill-container" style="padding: 16px; background-color: #eee">
  <x-fill name="fillTemplate" :value="['Item 1', 'Item 2', 'Item 3']"></x-fill>
</div>
<template name="fillTemplate">
  <div class="fill-item" style="margin: 10px; padding: 10px; border: red solid 1px">
    {{ $data }}
  </div>
</template>
```

在上述示例中，`x-fill` 使用名为 `fillTemplate` 的填充模板，并传递一个数组给它。填充模板中使用了 `{{ $data }}` 来渲染数组中的每个元素，从而实现了循环填充不同的字符串内容。

### x-fill 填充对象并且能自举填充的示例

`x-fill` 还可以填充包含更复杂结构的对象，并且支持自嵌套填充。

以下是一个使用 `x-fill` 填充对象并且能自嵌套填充的示例，展示了如何生成嵌套的内容：

```html
<div id="fill-container" style="padding: 16px; background-color: #eee">
  <x-fill name="nestedFillTemplate" :value="nestedData"></x-fill>
</div>
<template name="nestedFillTemplate">
  <div class="nested-item" style="margin: 10px; padding: 10px; border: red solid 1px">
    {{ $data.title }}
    <x-fill name="nestedFillTemplate" :value="$data.children"></x-fill>
  </div>
</template>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  nestedData: {
    title: "Parent",
    children: [
      {
        title: "Child 1",
        children: [
          { title: "Grandchild 1" },
          { title: "Grandchild 2" },
        ],
      },
      {
        title: "Child 2",
        children: [{ title: "Grandchild 3" }],
      },
    ],
  },
};
```

在上述示例中，`x-fill` 使用名为 `nestedFillTemplate` 的填充模板，并传递一个复杂的嵌套对象给它。填充模板中使用了 `{{ $data.title }}` 来渲染对象的标题，同时又使用了嵌套的 `x-fill` 来填充子项的内容，实现了嵌套的内容生成。

### $data、$ele、$host 在模板内的含义

在填充模板内，你可以使用特殊的标识符来访问不同的数据：

- `{{ $data }}`：表示传递给填充模板的数据，即 `value` 属性的值。
- `{{ $ele }}`：表示当前填充模板所在的元素，可以用于访问元素的属性和样式。
- `{{ $host }}`：表示宿主组件的实例，可以用于访问宿主组件的属性和方法。

这些特殊标识符可以帮助你在填充模板内动态地访问和渲染不同的数据。在示例中，你可以看到如何使用 `{{ $data.title }}` 来访问传递的数据的标题，以及如何使用 `{{ $host.num }}` 来访问宿主组件的属性。
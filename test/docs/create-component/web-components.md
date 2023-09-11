# 封装和组件化：组件化常规知识

ofa.js 是一个基于 Web Components 技术的封装库，旨在简化和加速组件开发过程。它通过将复杂的技术细节隐藏在背后，让开发者能够更专注地构建高质量的组件和应用。

为了更好地开发组件，有必要学习一些 Web Components 的知识。下面介绍的知识点不仅可以在 ofa.js 中应用，还可以让你在其他使用 Web Components 的框架上同样受益。

## Shadow DOM 容器

在 Web Components 中，Shadow DOM 提供了一种隔离的容器，用于封装组件内部的样式和结构。这意味着组件内部的样式和 DOM 结构不会与外部的样式和结构相互干扰，从而确保组件的可预测性和可维护性。

在 ofa.js 中，每个组件都有一个 Shadow DOM 容器，用于隔离组件的内部内容。模板内容就是被渲染到这个容器内。通过 `$` 获取的组件实例，也可以使用 `shadow` 属性访问组件内部的 Shadow DOM 容器，从而实现对组件内部元素的操作和访问。

```javascript
const myComponent = $("my-component"); // 获取组件实例
const shadowContainer = myComponent.shadow; // 获取组件的 Shadow DOM 容器

$("my-component").shadow.$("h1").css.color = 'red' // 将 Shadow DOM 的 h1 改为红色
```

## Web Components 中的常用 CSS 选择器

Web Components 提供了一些特殊的 CSS 选择器，用于选择和样式化组件内部的不同部分。以下是一些常用的选择器：

### :host 选择器

`:host` 选择器用于选择组件自身的外部容器。可以通过这个选择器来定义组件的样式。

```css
:host {
  display: block;
  border: 1px solid black;
  padding: 10px;
}
```

### ::slotted() 选择器

`::slotted()` 选择器用于选择被插槽内容包裹的元素。可以在组件内部的样式中使用这个选择器来样式化被插槽的内容。

```css
::slotted(p) {
  font-size: 18px;
  color: blue;
}
```

## 插槽（Slot）的使用

插槽是 Web Components 中用于在组件内部嵌入外部内容的机制。插槽允许开发者将自定义的内容传递到组件内部，实现更灵活的组件结构。

### 单个插槽

在组件模板中，可以使用 `<slot>` 元素来定义插槽。外部传入的内容会被插入到插槽内部。

```html
<!-- MyComponent.html -->
<div>
  <h2><slot></slot></h2>
</div>
```

```html
<!-- 使用 MyComponent -->
<my-component>
  <p>This is a slot content.</p>
</my-component>
```

### 多个命名插槽

除了默认插槽外，还可以定义多个命名插槽。命名插槽允许开发者将不同的内容插入到不同的插槽位置。

```html
<!-- MyComponent.html -->
<div>
    <header><slot name="header"></slot></header>
    <main><slot></slot></main>
    <footer><slot name="footer"></slot></footer>
</div>
```

```html
<!-- 使用 MyComponent -->
<my-component>
  <div slot="header">Header Content</div>
  <p>This is main content.</p>
  <div slot="footer">Footer Content</div>
</my-component>
```

## slotchange 事件的使用

`slotchange` 事件在插槽内容变化时触发。可以通过监听这个事件来执行一些与插槽内容相关的操作。

```javascript
// custom-component.mjs
export const type = $.COMP;

export default {
  data: {
    count: 0,
  },
  ready() {
    this.shadow.$("slot").on("slotchange", () => {
      console.log("Slot content has changed");
    });
  },
};
```
# 模板语法

`ofa.js` 提供了一系列强大的模板语法，使你能够更灵活地操作组件的界面元素和数据。这些模板语法能够帮助你实现丰富的界面效果和交互体验。

## 渲染文本语法

通过使用 `{{key}}` 的渲染文本语法，你可以将数据渲染为文本内容，并将其嵌入到组件的模板中。当数据发生变化时，对应的文本内容也会自动更新。

以下是一个使用文本渲染语法的示例：

```html
<!-- template.html -->
<div>
    <p>Welcome, {{username}}!</p>
</div>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  username: "JohnDoe",
};
```

在上述示例中，`{{username}}` 将会被组件的 `data` 中的 `username` 属性值所替代，从而在界面上显示出 "Welcome, JohnDoe!"。

## 属性绑定语法

使用 `:xxx='yyy'` 的属性绑定语法，你可以将组件的属性绑定到模板内元素的属性上。这种绑定是单向的，属性的变化会影响到模板内元素的属性，但不会反过来影响组件的属性。

以下是一些常见的属性绑定示例：

```html
<!-- template.html -->
<l-m src="custom-component.mjs"></l-m>  <!-- 加载 custom-component 组件 -->
<div>
    <p :text="greeting"></p>
    <input :value="inputValue" />
    <custom-component :custom-prop="customValue"></custom-component>
</div>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  greeting: "Hello, World!",
  inputValue: "",
  customValue: "Custom Value",
};
```

在上述示例中，`:text="greeting"` 将组件的 `data` 中的 `greeting` 属性值绑定到 `<p>` 元素的文本内容上。`:value="inputValue"` 将组件的 `data` 中的 `inputValue` 属性值绑定到 `<input>` 元素的 `value` 属性上。对于自定义组件，`custom-prop` 是自定义组件的属性名，它将组件的 `data` 中的 `customValue` 属性值传递给自定义组件。

## 事件绑定

使用 `on:click="yyy"` 的形式，你可以将目标元素的指定事件（例如 `click`）绑定到宿主组件的属性 `yyy` 上。这样，当目标元素触发指定事件时，会调用宿主组件中相应的属性方法。

以下是一个示例：

```html
<!-- template.html -->
<button on:click="increaseCount">Increase Count</button>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  count: 0,
};

export const proto = {
  increaseCount() {
    this.count++;
  },
};
```

在上述示例中，当按钮被点击时，会调用宿主组件的 `increaseCount` 方法，从而增加 `count` 属性的值。

## attributes 绑定

通过 `attr:xxx="yyy"` 的形式，你可以将目标元素的指定属性 `xxx` 绑定到宿主组件的属性 `yyy` 上。这样，目标元素的属性会随着宿主组件的属性变化而变化。

```html
<!-- template.html -->
<style>
[fontcolor="red"]{
    color: red;
}
</style>

<div attr:fontcolor="val">
 I am text
</div>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  val: "red",
};
```

在上述示例中，`attr:fontcolor="val"` 会将宿主组件的 `val` 属性绑定到 `<div>` 元素的 `fontcolor` attribute上。

## 动态类名绑定

使用 `class:xxx="yyy"` 的形式，你可以根据宿主组件的属性值来动态地为目标元素添加或移除类名。当宿主组件的 `yyy` 属性为 `true` 时，目标元素会添加类名 `xxx`；否则，会移除该类名。

```html
<!-- template.html -->
<style>
  button.active{
    background-color: red;
  }
</style>
<button class:active="isActive">Active Button</button>
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  isActive: false,
};
```

在上述示例中，如果 `isActive` 属性为 `true`，则按钮会添加 `active` 类名，从而应用特定的样式。

## 双向数据绑定

通过 `sync:xxx='yyy'` 的形式，你可以实现双向数据绑定。这使得目标元素的属性 `xxx` 和宿主组件的属性 `yyy` 保持同步，即目标属性的变化会反映到宿主属性上，宿主属性的变化也会同步到目标属性上。

以下是一个示例：

```html
<!-- template.html -->
<input sync:value="inputValue" />
```

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  inputValue: "Initial Value",
};
```

在上述示例中，`sync:value="inputValue"` 实现了一个双向数据绑定，当输入框的值发生变化时，`inputValue` 会自动更新；反之，当 `inputValue` 发生变化时，输入框的值也会随之变化。
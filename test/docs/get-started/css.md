 # CSS 的用法

在 `ofa.js` 中，你可以通过以下方式来操作元素的 CSS 样式；

## 获取元素的具体 CSS 样式

可以使用 `$ele.css.xxx` 来获取元素的具体 CSS 样式，其中 `xxx` 是你想要获取的 CSS 属性名。

### 示例

```html
<div id="myElement" style="color: blue; font-size: 18px;">Hello World</div>
<script>
  // 获取元素的颜色样式
  const myElement = $("#myElement");
  const colorStyle = myElement.css.color;
  console.log(colorStyle); // Output: "blue"

  // 获取元素的字体大小样式
  const fontSizeStyle = myElement.css.fontSize;
  console.log(fontSizeStyle); // Output: "18px"
</script>
```

## 设置某个样式属性

可以使用 `$ele.css.xxx = ''` 的方式来设置元素的 CSS 样式，其中 `xxx` 是你想要设置的 CSS 属性名。通过将属性值设为空字符串，可以将指定的样式属性移除。

### 示例

```html
<div id="myElement" style="color: blue; font-size: 18px;">Hello World</div>
<script>
  const myElement = $("#myElement");

  // 设置元素的颜色样式
  myElement.css.color = 'red';
  // 移除元素的字体大小样式
  myElement.css.fontSize = '';
</script>
```

## 赋值对象

可以使用 `$ele.css = {xxx}` 的方式来设置元素的 style，其中 `xxx` 是一个包含 CSS 属性名和属性值的对象。

### 示例

```html
<div id="myElement">Hello World</div>
<script>
  const myElement = $("#myElement");

  // 设置元素的样式
  myElement.css = {
    color: "red",
    fontSize: "24px",
    backgroundColor: "yellow",
  };
</script>
```

## 赋值字符串

可以使用 `$ele.css = 'color:red;...'` 的方式来设置元素的 style，其中 `'color:red;...'` 是一个包含 CSS 样式规则的字符串。

### 示例

```html
<div id="myElement">Hello World</div>
<script>
  const myElement = $("#myElement");

  // 设置元素的样式
  myElement.css = 'color:red; font-size:24px; background-color:yellow;';
</script>
```

## 设置 css 的技巧

你可以通过 `$ele.css = {...$ele.css, color:'red'}` 的方式来修改元素的某个样式属性，而不影响其他样式属性。这种方式可以在不重写整个样式的情况下，只修改其中一个属性。

### 示例

```html
<div id="myElement" style="color: blue; font-size: 18px;">Hello World</div>
<script>
  const myElement = $("#myElement");

  // 修改元素的颜色样式，同时保留其他样式属性不变
  myElement.css = { ...myElement.css, color: 'red' };
</script>
```

在上面的示例中，通过使用 `{ ...myElement.css, color: 'red' }`，我们只修改了元素的颜色样式，而将其他样式属性保持不变。这是一个很方便的技巧，可以灵活地修改元素的样式。
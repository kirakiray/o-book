# classList 和 data

## classList

在 `ofa.js` 中，你可以通过以下方式来操作元素的 classList： 
- `$ele.classList`: 返回元素的 classList 对象，用于操作元素的类名。

### classList 增删用法 

- 添加类名：`$ele.classList.add('className')`，将指定的类名添加到元素的 classList 中。 
- 移除类名：`$ele.classList.remove('className')`，从元素的 classList 中移除指定的类名。 
- 切换类名：`$ele.classList.toggle('className')`，如果元素的 classList 中已经存在该类名，则移除它；否则添加该类名。

### 示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>classList Demo</title>
    <style>
      .highlight {
        background-color: yellow;
      }
    </style>
    <script src="ofa.js"></script>
  </head>
  <body>
    <h2>classList Demo</h2>
    <div id="box" class="box">I am a box</div>
    <br />
    <button id="btnAdd">Add Highlight</button>
    <button id="btnRemove">Remove Highlight</button>
    <button id="btnToggle">Toggle Highlight</button>

    <script>
      const boxElement = $('#box');
      const btnAdd = $('#btnAdd');
      const btnRemove = $('#btnRemove');
      const btnToggle = $('#btnToggle');

      btnAdd.on('click', () => {
        boxElement.classList.add('highlight');
      });

      btnRemove.on('click', () => {
        boxElement.classList.remove('highlight');
      });

      btnToggle.on('click', () => {
        boxElement.classList.toggle('highlight');
      });
    </script>
  </body>
</html>
```

在这个示例中，有一个带有初始类名 `box` 的 `<div>` 元素，以及三个按钮：Add Highlight、Remove Highlight 和 Toggle Highlight。 
- 当点击 "Add Highlight" 按钮时，通过 `classList.add()` 方法将 `highlight` 类名添加到 `<div>` 元素中，使其具有黄色背景色。 
- 当点击 "Remove Highlight" 按钮时，通过 `classList.remove()` 方法从 `<div>` 元素的类名中移除 `highlight` 类名，恢复原始样式。 
- 当点击 "Toggle Highlight" 按钮时，通过 `classList.toggle()` 方法切换 `<div>` 元素的 `highlight` 类名。如果原本有该类名，则移除它，如果原本没有该类名，则添加它，实现样式的切换。

这样，你就可以通过 `classList` 对象来管理元素的类名，从而实现对元素样式的动态控制。

## data 的用法

在 `ofa.js` 中，你可以通过以下方式来操作元素的 data 属性： 
- `$ele.data`: 返回元素的 dataset 对象，用于操作元素的 data 属性。

### dataset 的具体用法

元素的 `data-*` 属性可以用于在 HTML 中存储自定义数据，可以通过 `data` 对象来访问这些属性。

例如，如果有一个元素定义了 `data-info` 属性：

```html
<div id="myElement" data-info="some information"></div>
```

你可以使用 `dataset` 来访问该属性：

```javascript
const myElement = $('#myElement');
const info = myElement.data.info;
console.log(info); // Output: "some information"
```

注意：`dataset` 对象中的属性名会将 `"data-"` 后面的部分转换为驼峰式命名。例如，`data-info` 变成了 `dataset.info`。如果要设置 `data-*` 属性，也可以通过 `dataset` 对象来实现：

```javascript
myElement.data.anotherInfo = "another value";
```

这样就会在元素上添加一个 `data-another-info` 属性，并设置其值为 `"another value"`。
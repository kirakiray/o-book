# 获取元素和事件相关

该章节旨在加强对上一章内容的理解，包括选择元素 和 事件绑定。

## 选择元素

在之前的章节中，我们已经了解了通过 $ 符号从全局获取某个元素的方法。接下来，我们将介绍其他获取元素的方法。

### 从元素内查找某个元素

#### 使用 `$("xxx").$('xxxx')` 的方式

`$("xxx").$('xxxx')` 是通过先选择一个父元素，然后在其内部查找符合条件的子元素的方式。其中，`$("xxx")` 选择了一个父元素，然后使用 `$('xxxx')` 在该父元素内查找符合条件的子元素。

#### 示例

```html
<div class="parent">
  <p>Hello World</p>
  <div class="child">
    <span>This is a child element</span>
  </div>
</div>
<script>
  // 选择父元素并查找子元素
  const parentElement = $(".parent");
  const childElement = parentElement.$(".child");

  // 修改子元素的文本内容
  childElement.text = "Modified child element";
</script>
```

在上面的示例中，首先通过 `$(".parent")` 选择了具有 `parent` 类的父元素，然后使用 `$(".child")` 在该父元素内查找具有 `child` 类的子元素。然后修改了子元素的文本内容为 "Modified child element"。

### 使用 `$('xxx xxxx')` 的方式

`$('xxx xxxx')` 是通过在全局范围内查找符合第二个选择器条件的元素，然后在这些元素内部查找符合第一个选择器条件的元素。这种方式可以直接一步到位地查找到符合条件的子元素。

#### 示例

```html
<div class="parent">
  <p>Hello World</p>
  <div class="child">
    <span>This is a child element</span>
  </div>
</div>
<script>
  // 直接查找符合条件的子元素
  const childElement = $('div .child');

  // 修改子元素的文本内容
  childElement.text = "Modified child element";
</script>
```

在上面的示例中，直接使用 `$('div .child')` 查找到具有 `child` 类的子元素，并修改了子元素的文本内容为 "Modified child element"。

### 选择多个元素

#### 使用 `$.all('xxx')` 查找全局的元素

`$.all('xxx')` 方法用于查找页面中所有符合选择器条件的元素，并将它们作为一个元素集合返回。这样可以选择页面中的多个元素进行批量操作。

#### 示例

```html
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<p>Paragraph 3</p>
<script>
  // 查找所有 p 标签元素
  const allParagraphs = $.all("p");

  // 修改所有 p 标签元素的文本内容
  allParagraphs.forEach((paragraph, index) => {
    paragraph.text = `Modified Paragraph ${index + 1}`;
  });
</script>
```

在上面的示例中，使用 `$.all("p")` 查找到页面中的所有 `p` 标签元素，并对它们进行了批量操作，将文本内容修改为 "Modified Paragraph 1"、"Modified Paragraph 2" 和 "Modified Paragraph 3"。

### 从元素内查找所有符合条件的元素

除了可以在全局范围内查找元素，还可以从某个元素内查找所有符合条件的子元素，使用方式为：`$('xxx').all('xxxx')`。

#### 示例

```html
<div class="container">
  <p>Hello World</p>
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
<script>
  // 从容器内查找所有带有 "item" 类的子元素
  const container = $(".container");
  const items = container.all(".item");

  // 修改所有子元素的文本内容
  items.forEach((item, index) => {
    item.text = `Modified Item ${index + 1}`;
  });
</script>
```

在上面的示例中，首先使用 `$(".container")` 查找到具有 `container` 类的元素，然后通过 `.all(".item")` 在该容器内查找所有带有 `item` 类的子元素，并对它们进行了批量操作，将文本内容修改为 "Modified Item 1"、"Modified Item 2" 和 "Modified Item 3"。

## 事件

前面已经讲过 `on` 绑定事件的使用方法，后面介绍几个和事件相关的方法；

### off 方法的使用文档

`off` 方法用于移除通过 `on` 方法绑定的事件处理函数。当不再需要某个事件的处理函数时，可以使用 `off` 方法将其从元素上移除，以避免重复执行或内存泄漏。

#### 语法

```javascript
$(selector).off(eventName, eventHandler);
```

- `selector`: 选择要移除事件处理函数的元素。 
- `eventName`: 要移除的事件名称。 
- `eventHandler`: 要移除的事件处理函数。

#### 示例

```html
<button id="btn">Click Me</button>
<script>
  const handleClick = () => {
    alert("Button clicked!");
  };

  // 绑定点击事件处理函数
  $("#btn").on("click", handleClick);

  // 5秒后移除点击事件处理函数
  setTimeout(() => {
    $("#btn").off("click", handleClick);
  }, 5000);
</script>
```

在上面的示例中，当点击按钮时，会弹出一个对话框显示 "Button clicked!"。但是在5秒后，通过 `off` 方法移除了点击事件处理函数，所以按钮再次点击时不会触发弹出对话框。

### one 方法的使用文档

`one` 方法用于绑定事件处理函数，但该处理函数只会在第一次触发事件时执行一次。在执行一次后，事件处理函数会被自动移除，避免重复触发。

#### 语法

```javascript
$(selector).one(eventName, eventHandler);
```

- `selector`: 选择要绑定事件处理函数的元素。 
- `eventName`: 要绑定的事件名称。 
- `eventHandler`: 要执行的事件处理函数。


#### 示例

```html
<button id="btn">Click Me Once</button>
<script>
  // 绑定点击事件处理函数，但只会执行一次
  $("#btn").one("click", () => {
    alert("Button clicked once!");
  });
</script>
```

在上面的示例中，当点击按钮时，会弹出一个对话框显示 "Button clicked once!"。但是在第一次点击后，事件处理函数就会被移除，所以后续点击按钮不会再触发弹出对话框。

### emit 方法的使用文档

`emit` 方法用于手动触发元素上绑定的特定事件。通过 `emit` 方法可以在不进行实际操作的情况下触发事件处理函数的执行。

#### 语法

```javascript
$(selector).emit(eventName);
```
 
- `selector`: 选择要触发事件的元素。 
- `eventName`: 要触发的事件名称。

#### 示例

```html
<button id="btn">Click Me</button>
<script>
  // 绑定点击事件处理函数
  $("#btn").on("click", () => {
    alert("Button clicked!");
  });

  // 通过 emit 方法触发按钮的点击事件
  $("#btn").emit("click");
</script>
```

在上面的示例中，通过 `emit` 方法手动触发了按钮的点击事件，结果会弹出一个对话框显示 "Button clicked!"，尽管没有实际点击按钮。

注意：使用 `emit` 方法不会模拟鼠标点击或其他实际事件，它只会直接调用已绑定的事件处理函数。所以，如果你希望在特定情况下触发事件的执行，可以使用 `emit` 方法。


当你绑定事件后，有时你可能希望阻止事件的进一步传播（冒泡）或取消事件的默认行为。下面将介绍如何在事件触发后禁止冒泡和取消默认事件。

### 禁止事件冒泡

事件冒泡是指当一个元素上的事件被触发时，它会沿着 DOM 树向上冒泡，依次触发父元素上的同类型事件。如果你希望在特定元素上处理事件后阻止其继续冒泡，可以使用 `event.stopPropagation()` 方法。

示例代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stop Event Bubbling</title>
  <script src="../ofa.js"></script>
</head>
<body>
  <div id="outer">
    <div id="inner">
      <button id="btn">Click Me</button>
    </div>
  </div>

  <script>
    const btn = $('#btn');
    const innerDiv = $('#inner');

    btn.on('click', (event) => {
      alert('Button Clicked!');
      event.stopPropagation(); // 阻止事件冒泡
    });

    innerDiv.on('click', () => {
      alert('Inner Div Clicked!');
    });

    $('#outer').on('click', () => {
      alert('Outer Div Clicked!');
    });
  </script>
</body>
</html>
```

在上面的示例中，当你点击按钮 "Click Me" 后，它会显示 "Button Clicked!"，但不会触发 "Inner Div Clicked!" 和 "Outer Div Clicked!"。这是因为我们在按钮的点击事件处理程序中调用了 `event.stopPropagation()`，阻止了事件的进一步传播。

### 取消事件的默认行为

有些元素上的事件在触发时会有默认的行为。例如，点击提交按钮会导致表单提交，点击链接会跳转到链接的地址等。如果你希望阻止事件的默认行为，可以使用 `event.preventDefault()` 方法。

示例代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prevent Default Event</title>
  <script src="../ofa.js"></script>
</head>
<body>
  <form id="myForm">
    <label for="name">Name:</label>
    <input type="text" id="name" />
    <button id="submitBtn">Submit</button>
  </form>

  <script>
    const form = $('#myForm');
    const submitBtn = $('#submitBtn');

    submitBtn.on('click', (event) => {
      event.preventDefault(); // 取消事件的默认行为
      const name = $('#name').value;
      alert(`Hello, ${name}! Form submission prevented.`);
    });

    form.on('submit', () => {
      alert('Form Submitted!');
    });
  </script>
</body>
</html>
```

在上面的示例中，当你点击提交按钮 "Submit" 后，它会显示 "Hello, {name}! Form submission prevented."，但不会触发 "Form Submitted!" 的警报。这是因为我们在提交按钮的点击事件处理程序中调用了 `event.preventDefault()`，阻止了表单的提交默认行为。
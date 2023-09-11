# 第一个案例

以下是一个案例，点击按钮后将文本更改为 "Hello World"：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hello-world</title>
    <script src="../ofa.js"></script>
  </head>
  <body>
    <div id="desk">Please click the button</div>
    <br />
    <button id="btn">I am Button</button>
    <script>
      $("#btn").on("click", () => {
        $("#desk").html = "<b>Hello World</b>";
      });
    </script>
  </body>
</html>
```

当点击按钮后，将会显示加粗的 "Hello World" 文本。

现在，让我们详细解释一下基础概念。

## 选择器

引用了 `ofa.js` 后，`$` 符号将被注册到全局作用域中。通过 `$('xxx')` 来选择符合条件的**第一个** 元素，其中 `xxx` 是标准的 [CSS Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)  内容。你可以点击链接查看具体的选择器内容。

以下是一个例子：

```html
<p>I am P tag</p>
<div id="desk">I am desk</div>
<div class="logger">I am logger</div>
<script>
    setTimeout(() => {
        $("p").text = "change P tag";
        $("#desk").text = "change #desk";
        $(".logger").text = "change .logger";
    }, 1000);
</script>
```

在上面的案例中，打开页面一秒后，会分别改变 **p标签** 、**#desk** 和 **.logger**  的文本内容。

## 事件绑定

选择元素成功后，你可以为元素绑定事件。就像前面提到的 "Hello World" 案例中，我们给 id 为 "btn" 的元素绑定了点击事件。当点击按钮后，绑定的函数会被执行。

你可以点击跳转查看 [事件示例](./example-event.md)  章节，了解一些事件绑定的案例；

所有可用的事件，可以参考 [Web Events](https://developer.mozilla.org/en-US/docs/Web/Events) 来了解完整的事件列表。

## 属性

在上面的两个案例中，我们分别展示了 `html` 和 `text` 属性的使用。

你还可以通过 `html` 或 `text` 属性来获取元素的内容，如下所示：

```html
<div id="t1">
    <span style="color: red">I am text</span>
</div>
<div id="t2"></div>
<br />
<div id="t3"></div>
<br />
<script>
    $("#t2").text = $("#t1").html;
    $("#t3").html = $("#t1").html;
</script>
```

这个例子中，我们将 #t1 元素内的 HTML 内容赋值给了 #t2 和 #t3 元素。

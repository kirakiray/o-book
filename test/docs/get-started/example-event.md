# 事件示例

## 点击事件（click）

在这个案例中，当点击按钮时，会在控制台输出一条消息。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example of a click event</title>
    <script src="../ofa.js"></script>
  </head>
  <body>
    <button id="btn">Open the console and click on me</button>
    <script>
      $("#btn").on("click", () => {
        console.log("The button was clicked!");
      });
    </script>
  </body>
</html>
```


## 鼠标移入事件（mouseenter）

在这个案例中，当鼠标移入文本区域时，文本颜色会变为红色。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mouseover event example</title>
    <script src="../ofa.js"></script>
    <style>
      #text-area {
        font-size: 18px;
        color: black;
      }
    </style>
  </head>
  <body>
    <div id="text-area">Hover over here.</div>
    <script>
      $("#text-area").on("mouseenter", () => {
        $("#text-area").css.color = 'red';
      });

      $("#text-area").on("mouseleave", () => {
        $("#text-area").css.color = 'black';
      });
    </script>
  </body>
</html>
```


## 键盘按键事件（keydown）

在这个案例中，当在输入框内按下任意键时，会在控制台输出按下的键的信息。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>keydown</title>
    <script src="../ofa.js"></script>
  </head>
  <body>
    <h3>Viewing printouts after opening the console</h3>
    <input type="text" id="input-box" placeholder="Press any key" />
    <script>
      $("#input-box").on("keydown", (event) => {
        console.log("keydown:", event.key);
      });
    </script>
  </body>
</html>
```

这些示例分别演示了点击事件、鼠标移入事件和键盘按键事件的使用。你可以尝试将这些代码复制到一个 HTML 文件中，并在浏览器中运行，以查看效果。

所有可用的事件，可以参考 [Web Events](https://developer.mozilla.org/en-US/docs/Web/Events) 来了解完整的事件列表。
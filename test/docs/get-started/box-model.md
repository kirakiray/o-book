# 盒模型

在前端开发中，经常会用到一些表示元素尺寸的属性。这些属性包括 width、height、clientWidth、clientHeight、offsetWidth、offsetHeight、outerWidth 和 outerHeight。了解它们的含义和用法对于开发响应式和动态布局非常重要。下面让我们一一解释它们，并通过一个示例来演示。

- width：表示元素的内容区域的宽度，不包括内边距、边框和外边距。
- height：表示元素的内容区域的高度，不包括内边距、边框和外边距。
- clientWidth：表示元素的可见内容区域的宽度，包括内边距，但不包括边框和外边距。
- clientHeight：表示元素的可见内容区域的高度，包括内边距，但不包括边框和外边距。
- offsetWidth：表示元素的整体宽度，包括内容区域、内边距、边框和外边距。
- offsetHeight：表示元素的整体高度，包括内容区域、内边距、边框和外边距。
- outerWidth：表示元素的整体宽度，包括内容区域、内边距、边框、外边距，但不包括滚动条的宽度。
- outerHeight：表示元素的整体高度，包括内容区域、内边距、边框、外边距，但不包括滚动条的高度。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Element box model Demo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    #box {
      width: 200px;
      height: 150px;
      background-color: #f0f0f0;
      border: 2px solid #333;
      padding: 20px;
      margin: 30px;
    }
  </style>
  <script src="../ofa.js"></script>
</head>
<body>
  <div id="box">I am a div element.</div>

  <script>
    const box = $('#box');

    console.log(`width: ${box.width}px`); // => width: 200px
    console.log(`height: ${box.height}px`); // => height: 150px
    console.log(`clientWidth: ${box.clientWidth}px`); // => clientWidth: 240px
    console.log(`clientHeight: ${box.clientHeight}px`); // => clientHeight: 190px
    console.log(`offsetWidth: ${box.offsetWidth}px`); // => offsetWidth: 244px
    console.log(`offsetHeight: ${box.offsetHeight}px`); // => offsetHeight: 194px
    console.log(`outerWidth: ${box.outerWidth}px`); // => outerWidth: 304px
    console.log(`outerHeight: ${box.outerHeight}px`); // => outerHeight: 254px
  </script>
</body>
</html>

```
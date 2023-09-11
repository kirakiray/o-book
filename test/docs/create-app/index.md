# 开发应用

除了可以开发组件，`ofa.js` 还可以用于开发功能完整的应用程序。

`ofa.js` 将应用程序集成为一个 `o-app` 组件，通过直接使用这个标签，你就能够快速创建应用程序。这种方式使应用的创建变得简单且高效。

此外，`ofa.js` 官方还提供了完整的**路由**和**SSG（静态页面生成）**方案，帮助开发者构建更健全的应用程序。这些功能能够加速开发流程，让你能够专注于应用程序的逻辑和用户体验，而不必过多担心底层细节。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>app test demo</title>
    <script src=".././../ofa.js"></script>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
      }

      o-app {
        display: block;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <o-app>
      <o-page src="./pages/hello.html"></o-page>
    </o-app>
  </body>
</html>
```

上面是一个简单的应用教程代码示例，接下来会逐步讲解应用的开发过程。
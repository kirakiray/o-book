# o-router 组件的使用

`o-router` 组件是一个用于将 `o-app` 内的路由绑定到当前浏览器标签页的组件，它能够帮助你更方便地管理页面路由和展示。

## 引用 o-router 组件

首先，你需要在页面中引用 `o-router` 组件。你可以通过以下方式引用 `router.mjs` 文件：

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.0.0/libs/router/dist/router.min.js"></script>
```

## 使用 o-router 组件

使用 `o-router` 组件是通过将其包裹在 `o-app` 组件外部来实现的。这样可以将应用内的路由绑定到当前浏览器标签上。

```html
<o-router>
    <o-app src="app-config.mjs"></o-app>
</o-router>
```

## fix-body 属性

`o-router` 组件还提供了 `fix-body` 属性，当你设置了该属性后，组件会自动为 `<html>` 标签添加样式，使应用的尺寸等于页面的大小，从而让应用的内容充满整个窗口。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script src="ofa.js"></script>
    <!-- 引用 o-router 组件 -->
    <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.0.0/libs/router/dist/router.min.js"></script>
  </head>
  <body>
    <!-- 使用 o-router 组件，并设置 fix-body 属性 -->
    <o-router fix-body> 
      <o-app src="app-config.mjs"></o-app>
    </o-router>
  </body>
</html>
```
# 制作应用

使用 `o-app` 标签可以轻松地创建一个完整的应用程序窗口。下面是如何制作一个应用并配置它的步骤：

## 基础代码

1. 创建一个 HTML 文件，设置 `o-app` 标签为应用的显示窗口。确保为 `o-app` 设置全屏的样式，以使应用占据整个视口。

```html
<!-- app.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    o-app {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>
  <script src="../../ofa.js"></script>
</head>
<body>
  <o-app></o-app>
</body>
</html>
```

2. 创建一个 es 模块，用于设置应用的配置数据。配置数据包括以下选项：

   - `home`：字符串类型，应用的首页的页面模块地址。
   - `loading`：函数类型，应用在加载新页面时，会运行这个函数，得到的内容会插入到应用中，作为加载时的提示，等到页面加载完成后，会自动去除这个 loading 元素。
   - `fail`：函数类型，应用加载页面失败时，会运行这个函数，返回得到的值会显示在应用中作为加载失败的提示。函数会带有加载失败页面的 `src` 地址和错误报错对象。
   - `pageAnime`：页面之间切换时的动画配置。

下面是应用的配置数据示例：

```javascript
// app-config.mjs
export const home = "./pages/home.mjs?count=1";

export const loading = () => {
  const loadingEl = $(`<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;word-break:break-all;">Loading</div>`);
  return loadingEl;
};

export const fail = ({ src, error }) => {
  return `<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;word-break:break-all;" data-testid="error-container">
    <div style="padding:20px;text-align:center;">
      <h3>Load Fail</h3> 
      <p>${error.stack}</p>
      ${src}
      <div>
        <button on:click="back()">Back</button>
      </div>
    </div>
  </div>`;
};

export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

3. 在 HTML 文件中使用 `o-app` 标签，并通过 `src` 属性引用配置数据的 es 模块。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
    o-app {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>
  <script src="../../ofa.js"></script>
</head>
<body>
  <o-app src="./app-config.mjs"></o-app>
</body>
</html>
```

通过以上步骤，你已经成功制作了一个使用 `o-app` 组件的应用程序窗口。`o-app` 组件会根据配置数据中的设置加载页面，展示加载中的提示或加载失败的提示，并支持页面切换动画。这样，你可以快速搭建一个功能完整且具有交互性的应用程序。

## 路由跳转

在 `o-app` 应用中，你可以轻松地实现路由跳转，从一个页面模块跳转到另一个页面模块。下面介绍几种不同的方式来进行路由跳转。

### 使用 `<a>` 标签进行路由跳转

你可以在页面的 HTML 中使用 `<a>` 标签来实现路由跳转。需要将 `href` 属性指定为目标页面模块的路径，并添加 `olink` 属性，以告知 `o-app` 组件这是一个路由链接。

```html
<a href="./pages/home.mjs?count=2" olink>跳转到首页</a>
```

### goto

你可以在页面模板中使用 `on:click` 属性来绑定点击事件，并调用模块上的 `goto` 方法进行路由跳转。

```html
<template page>
  <div class="container">
    <button on:click="toabout">跳转到关于页面</button>
  </div>

  <script>
    export default async ({ query }) => {
      return {
        proto: {
          toabout() {
            this.goto("./about.mjs");
          },
        },
      };
    };
  </script>
</template>
```

又或者直接卸载目标元素上：

```html
<button on:click="goto('./pages/about.mjs')">跳转到关于页面</button>
```

### 替换跳转和返回页面

除了 `goto` 方法外，`o-app` 还支持 `replace` 和 `back` 方法。

- `replace` 方法用于替换跳转，它会取代当前页面的路由，使新页面成为当前页面的路由。

```html
<button on:click="replace('./pages/settings.mjs')">跳转并替换当前页面</button>
```

- `back` 方法用于返回到前一个页面。

```html
<button on:click="back()">返回上一页</button>
```

需要注意的是，应用内会保持组件的路由状态，但路由数据不会绑定到当前浏览器标签上。这样，你可以方便地在应用中实现页面之间的跳转和导航。

如果你想实现路由和页面的绑定，可以使用 o-router 组件，我们将在后面的章节中详细介绍。

通过以上方法，你可以在 `o-app` 应用中实现灵活的路由跳转，让用户能够方便地浏览不同的页面内容。

## 访问应用和当前页面

在应用内的各个元素（包括组件），你通过 **app** 属性来获取它们所在的 `o-app` 实例。这对于需要与整个应用进行交互的操作非常有用。

通过 `app.current` 属性，你可以获取当前激活的页面模块的地址。

以下是一个使用示例：

```javascript
// MyComponent.mjs
export default () => {
  return {
    attached(){
      const appTag = this.app;

      const currentPage = appTag.current;
      console.log(`当前激活的页面是：${currentPage}`);
    }
  };
}
```

在上面的示例中，通过选择器 `.app` 获取了应用标签，然后通过访问 `app.current` 属性获取了当前激活的页面地址。

## 使用技巧：提前缓存下一页

在一些场景下，你可能已经预知用户即将跳转到下一页。为了提高用户体验，你可以提前缓存下一页的页面模块，这样在实际跳转时可以立即加载，减少用户等待的时间，让用户体验更加流畅。。

在当前页面的 JavaScript 代码中，调用 `load` 方法并传入下一页的模块路径，该模块将被加载并缓存。

```javascript
// MyComponent.mjs
export default async ({ load }) => {
  //   await load('./pages/next-page.mjs');
  load('./pages/next-page.mjs'); // 这是一个仅用于缓存，非当前页必须模块，无需添加 await
};
```
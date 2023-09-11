# 子路由模式

在 ofa.js 中，设置子路由与一些前端框架的做法略有不同。ofa.js 使用一种更加直观的方式，通过在页面模块上设置父页面来作为容器，从而实现子路由的需求。

## 设置父页面容器

要创建子路由，首先需要在子页面的页面模块上设置 `parent` 参数，指定父页面的页面模块地址。这样，在子页面加载时，ofa.js 会自动将子页面包裹在父页面容器中。

```html
<template page>
  <h1>Page 1</h1>

  <script>
    export const parent = "./layout-page.html";
  </script>
</template>
```

在上述示例中，子页面的页面模块通过 `parent` 参数指定了父页面容器的地址。

## 父页面容器模板设置

父页面容器的模板需要设置一个 `<slot>` 元素，以便子页面能够插入到父页面的指定位置。同时，确保 `<slot>` 元素的容器元素设置为 `position: relative`，这是非常重要的，因为子页面会在父页面容器中绝对定位。

以下是一个父页面容器的示例模板：

```html
<!-- layout-page.html -->
<template page>
  <style>
    /* 设置容器元素为 relative 定位 */
    .parent-container {
      position: relative;
    }
  </style>
  
  <!-- 设置容器元素，用于插入子页面 -->
  <div class="parent-container">
    <slot></slot>
  </div>
</template>
```

在上述示例中，通过设置一个带有 `slot` 的容器元素，子页面会被插入到该容器中。确保容器元素具有相对定位，这样子页面可以根据容器定位。

通过使用这种方式，你可以更直观地配置子路由，通过设置父页面容器和子页面的关联，来实现子页面的加载和渲染。

## 父页面的路由监听

在某些情况下，多个页面共用同一个父页面作为容器，当这些页面之间进行跳转时，父页面不会被刷新。这种情况下，父页面仍然可以监听路由的变动，以便在不刷新页面的情况下执行相应的操作。

### 监听路由变动

父页面模块可以设置一个 `routerChange` 函数，用于监听路由的变动。当页面发生路由切换且不刷新父页面时，将触发 `routerChange` 事件。这个事件会传递当前页面的信息，以及跳转的方式（`type`）。

以下是一个父页面模块的示例，展示了如何设置 `routerChange` 函数来监听路由变动：

```javascript
// 父页面的页面模块
export const routerChange = (current, type) => {
  console.log(`路由切换：当前页面为 ${current.src}，切换方式为 ${type}`);
};
```

在上述示例中，`routerChange` 函数接收两个参数，`current` 表示当前页面的地址，`type` 表示跳转的方式。当页面发生路由切换时，该函数会被触发，并输出相应的信息。
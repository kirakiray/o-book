# 制作和使用组件

ofa.js 使用基础的 HTML 和 JavaScript 文件来定义组件，避免引入新的文件类型以减少学习成本。只要你对 HTML 有一定的了解，就能够快速开发和使用 ofa.js 组件。

## 准备创建组件前的步骤

在开始创建组件之前，需要注意一些准备工作。由于创建组件涉及到浏览器请求资源的操作，如果你仅仅是双击打开 HTML 文件来查看，会在 "file" 协议下进行查看。在 "file" 协议下，JavaScript 模块的加载可能会报错。因此，你需要准备一个静态服务器来正确查看组件。

如果你使用的是 Visual Studio Code 编辑器，你可以简单地安装一个支持静态服务器的插件。我们推荐使用 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件。

安装插件后，只需在 `demo.html` 文件上右键点击，选择 "Open with Live Server"，插件将会自动以静态服务器模式打开文件。

如果你使用的是其他编辑器，你也可以创建一个 Nginx 或 Apache 服务器，只要能够支持静态 HTML 查看即可。这样做可以确保你能够正常预览和开发你的组件。

## 创建一个按钮组件

下面，我们将创建一个简单的按钮组件，命名为 **simple-button**，它将具有比原生按钮更美观的样式。

首先，创建一个名为 `simple-button.html` 的文件，其中使用 `<template>` 标签，并添加 `component` 属性以标识为组件。

然后，在 `<template>` 内部编写组件的模板代码。接着，在模板内容下方，添加一个 `<script>` 标签，将组件的 JavaScript 代码放入其中。

```html
<!-- simple-button.html -->
<template component>
  <style>
    .shadow-button {
      background-color: #4caf50;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      border-radius: 10px;
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
    .shadow-button:hover {
      opacity: 0.8;
    }

    .shadow-button:active {
      transform: translateY(4px);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    }
  </style>

  <button class="shadow-button">
    <slot></slot>
  </button>

  <script>
    // 不要使用 import
    // import data from './other/module.mjs';

    // 需要注册的组件名，如果没有定义 tag 属性，注册的组件名与文件名保持一致
    export const tag = 'simple-button';

    export default async ({load}) => {
      // 引用其他模块
      // const data = await load("./other/module.mjs");
    }
  </script>
</template>
```

在成功引入 ofa.js 后，会自动注册 `load-module` 组件，这是一个用于声明式引用模块的组件，类似于 script 标签。该组件会代理加载指定 `src` 的模块，并对需要加载的模块进行预处理。在本案例中，会加载模板并注册 simple-button 组件。

`load-module` 组件还可以使用缩写 `l-m`，以减少代码量。

```html
<!-- demo.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>simple-button</title>
    <script src="../../ofa.js"></script>
    <!-- <load-module src="./simple-button.html"></load-module> -->
    <!-- l-m 组件等同于 load-module 组件，可以写少一点代码 -->
    <l-m src="./simple-button.html"></l-m>
  </head>
  <body>
    <simple-button>I am a button</simple-button>
  </body>
</html>
```

`load-module` 组件是一个定制的**声明式加载器**库，提供了强大的功能，可以扩展支持各种类型的文件，或者对 JavaScript 模块进行中转处理。它已经拆分成了一个独立的项目，具体的使用文档在 [https://github.com/kirakiray/drill.js](https://github.com/kirakiray/drill.js)。

### 双文件模式

双文件模式将 `静态模板` 和 `逻辑代码` 分开，使组件更加清晰。

逻辑代码放在 js 文件内，这个 js 需要标识 `export const type = $.COMP;`，以通知页面这是一个组件模块。在这种拆分模式下，模块代码可以使用 `import` 等 ES Module 的标准语法。

按钮组件由两个文件组成：

1. **simple-button.html**：按钮组件的 HTML 模板和样式。

```html
<!-- simple-button.html -->
<style>
  .shadow-button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 10px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
  .shadow-button:hover {
    opacity: 0.8;
  }

  .shadow-button:active {
    transform: translateY(4px);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>

<button class="shadow-button">
  <slot></slot>
</button>
```

2. **simple-button.mjs**：按钮组件的注册代码。

```javascript
// simple-button.mjs
export const type = $.COMP;

// 需要注册的组件名，当没有定义 tag 属性时，注册的组件名与文件名保持一致
// export const tag = 'simple-button';

// 组件模板的地址，当没有定义时，默认载入和当前模块同目录下的和组件同名的 html 文件
// export const temp = './simple-button.html';
```

在需要使用该组件的地方，使用 `l-m` 引入这个模块。以下是使用 simple-button 的案例页面（双文件模式）。

```html
<!-- demo.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>simple-button</title>
    <script src="ofa.js"></script>
    <l-m src="./simple-button.mjs"></l-m> 
  </head>
  <body>
    <simple-button>I am a button</simple-button>
  </body>
</html>
```
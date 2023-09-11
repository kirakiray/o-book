# 静态客户端渲染(SCSR)

## 什么是 SCSR？

SCSR 全名 Static Client-Side Rendering，称为静态客户端渲染；静态客户端渲染（SCSR）是 CSR（Client-Side Rendering）的一种变种，它在保留了 CSR 用户体验的基础上，还能够让页面在静态状态下被爬虫获取。

## 如何使用 SCSR

你可以通过以下方式引用 SCSR 库：

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.0.0/libs/scsr/dist/scsr.min.js"></script>
```

## SCSR 的工作原理

SCSR 是通过直接运行单文件模式的页面模块，而无需使用 `o-page` 标签，从而实现在页面上进行渲染。具体来说，就是将页面模块的模板代码直接放在 `o-app` 内。

以下是一个 SCSR 示例，展示了如何在页面上直接渲染页面模块的内容：

```html
<!-- home.html --><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home</title>
    <link rel="stylesheet" href="./public.css" />
    <script src="../../ofa.js"></script>
    <script src="./scsr.min.js"></script>
  </head>
  <body>
    <o-app src="./app.mjs">
      <template page>
        <div class="container">
          <h1 class="title">Hello, World!</h1>
          <p class="subtitle">Welcome to my ofa.js page.</p>
          <div>count => {{count}}</div>
          <a href="./pages/help.html" olink>GO TO HELP</a>
        </div>

        <script>
          export default async ({ query }) => {
            return {
              data: { count: query.count || 0 },
            };
          };
        </script>
      </template>
    </o-app>
  </body>
</html>
```

通过 SCSR，`template` 标签内的内容会被直接渲染到页面上，而这部分内容实际上就是单文件模式的页面模块。

继续以上面的 `home.html` 页面为例，我们创建一个 `help` 页面：

```html
<!-- pages/help.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Help</title>
    <link rel="stylesheet" href="../public.css" />
    <script src="../../../ofa.js"></script>
    <script src="../scsr.min.js"></script>
  </head>
  <body>
    <o-app src="../app.mjs">
      <template page>
        <div class="container">
          <h1 class="title">Help Page</h1>
          <button on:click="back()">GO Back</button>
        </div>

        <script>
          export default async ({ query }) => {
            return {
              proto: {},
            };
          };
        </script>
      </template>
    </o-app>
  </body>
</html>

```

在 `home.html` 页面中点击 "GO TO HELP" 后，将平滑跳转到 `help.html` 页面，实现了客户端渲染的平滑跳转效果。

## 注意事项

所有采用 SCSR 方案的页面，除页面描述性的内容（如 title、meta:description、keywords）和页面模板内容外，其他引用资源必须保持一致，以确保在页面跳转和刷新后的体验一致。

## 关于 SSR 方案

当前的 SCSR 方案实际上更类似于一种 SSG（Static Site Generation）方案，因为它将页面预先渲染成静态内容，然后再通过客户端进行交互。ofa.js 已经提供了相对独立的组件封装方案，使得前端开发人员可以将组件封装好，然后结合传统的后端渲染页面方案（如 Node.js、Go、Java、PHP 等语言的网站渲染框架），后端开发人员可以快速使用这些封装好的组件来构建优质的网页。

我们计划在未来提供一个完整的 SSR（Server-Side Rendering）方案。这个方案的原理大致是先获取下一页的元素内容，然后与当前页的标签内容进行对比，从而进行动态的增加、删除和修改属性值等操作。不过需要注意的是，这个 SSR 方案会比较耗费时间，因为这个过程涉及到复杂的元素比较和修改操作。

ofa.js 是一个新兴的框架，而且作者的业余时间也有限，暂时还没有完整开发出这个 SSR 方案。但如果未来 ofa.js 能够得到更多的用户使用，并且出现了对于 SSR 方案的强烈需求时，作者会继续完善并开发这个方案。目前，作者会专注于框架的稳定性和功能扩展，同时也欢迎用户的反馈和建议，以便未来更好地满足用户的需求。
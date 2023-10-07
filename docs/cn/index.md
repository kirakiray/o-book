# obook：最简单的文档建站工具

<l-m src="https://cdn.jsdelivr.net/npm/obook@2.1.21/blocks/simp-block.html"></l-m>


<simp-block>

## 一步封装组件，无繁琐流程

现在，我们来快速制作一个组件

<comp-viewer comp-name="my-switch" max-height="500" style="width:100%;">

```html
<template component>
  <style>
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
      background-color: #ccc;
      transition: background-color 0.4s;
      border-radius: 34px;
      cursor: pointer;
    }

    .slider {
      position: absolute;
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: transform 0.4s;
      border-radius: 50%;
    }

    .switch.checked {
      background-color: #2196f3;
    }

    .switch.checked .slider {
      transform: translateX(26px);
    }
  </style>
  <div class="switch" class:checked="checked" on:click="checked = !checked">
    <span class="slider"></span>
  </div>
  <script>
    export default {
      tag: "my-switch",
      data: {
        checked: true,
      },
    };
  </script>
</template>
```

</comp-viewer>


<html-viewer style="width:100%;">

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.20/dist/ofa.min.js"></script><!-- 将 ofa.js 引入项目 -->

<l-m src="https://kirakiray.github.io/ofa-v4-docs/docs/publics/comps/punch-logo.html"></l-m><!-- 加载开发好的 punch-logo 组件 -->
```

```html
<!-- 使用 punch-logo 组件 -->
<punch-logo style="margin:50px 0 0 100px;">
    <img src="https://kirakiray.github.io/ofa-v4-docs/docs/publics/logo.svg" logo height="90" />
    <h2>不加班了</h2>
    <p slot="fly">现在就要</p>
    <p slot="fly">晚点再走</p>
    <p slot="fly">周末加班</p>
</punch-logo>
```

</html-viewer>

</simp-block>

<simp-block>

<img src="../publics/logo.svg" class="logo" />

## obook是什么？

### 如果您只想专注于写文档，希望快速创建免费且精美的网站，那么obook就是您的不二选择

[使用文档](./docs/index.md)

</simp-block>

<simp-block>

## 极度简单

### 你甚至可以不看文档，使用我们的Web应用程序，也能轻松起步

[obook previewer](https://kirakiray.github.io/o-book/webapp/)

</simp-block>

<simp-block>

## 完全免费

### 生成的是静态网站，可以将其托管在GitHub Pages上，无需购买服务器

</simp-block>

<simp-block>

## 功能强大

### 兼容移动端，包含白天黑夜模式；打包好的文档站，具备完整的搜索功能

使用其他文档站生成器，可能需要购买搜索微服务

</simp-block>

<simp-block>

## 多语言支持

### 网站原生组件提供多语言支持

目前支持**英语**，**简体中文**，**繁体中文**，**西班牙语**

</simp-block>

<simp-block>

## 案例

当前站点就是案例

</simp-block>
# 初始文件

下面为项目初始化文件教程，如果不想理解 o-book 的大概初始化配置，可点击下方下载初始化好的 **快速开始项目**；

<a href="../quickStart/quickStart.zip">下载快速开始项目</a>

<a href="../quickStart/index.html">查看快速开始项目</a>

## 入口html

新建一个 `html` 文件，并引用 `o-book` 组件；

```html
<!--o-book.js 依赖 ofa.js-->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.js"></script> 
<script src="https://cdn.jsdelivr.net/gh/kirakiray/o-book@latest/o-book.js"></script>

<!-- 引用组件 -->
<o-book summary="SUMMARY.md" home="docs/readme.md" style="height:100%;">
    <div style="display:flex;width:100%;height:100%;justify-content:center;align-items:center;">Loading...</div>
</o-book>
```

也可以**直接拷贝**下面的代码，用于创建入口文件；

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>o-book</title>
    <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/kirakiray/o-book@latest/o-book.js"></script>
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
    </style>
</head>

<body>
    <o-book summary="SUMMARY.md" home="docs/readme.md" style="height:100%;">
        <div style="display:flex;width:100%;height:100%;justify-content:center;align-items:center;">Loading...</div>
    </o-book>
</body>

</html>

```

## 首页和目录文件

创建 `SUMMARY.md` 和 `readme.md` 文件，并设置为`o-book` 组件的 `summary` 和 `home`属性，值为相对文件的地址；(例如上面建的案例，已经设置好了 `summary` 和 `home` 属性)

`home` 为首页文章地址；

`summary.md` 记录这个电子书籍的目录结构，接下来会详细讲。
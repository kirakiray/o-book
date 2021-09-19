# code-view 组件

方便阅读多个文件源代码的预览组件；

<!-- > 既能用ofajs开发组件，也能开发辅助组件开发的组件; -->

## 使用方法

#### 方法1：script标签引用

先将 ofajs 和 code-view 组件引用到网页；（确保 code-view 在 ofajs 后载入）

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kirakiray/o-book/comps/code-view/code-view.js"></script>
```

#### 方法2：load函数引用

使用 ofajs 模块化系统引用；

```javascript
load("https://cdn.jsdelivr.net/gh/kirakiray/o-book/comps/code-view/code-view.js");
```

然后直接使用 `code-view`标签，添加 `src` 属性为文件包地址（文件包的具体内容下面会讲）；

```html
<code-view src="demo.json"></code-view>
```

## 预览

这个预览为预览当前页 `code-view` 组件包的预览效果；

> 注意：`code-view` 的预览页面原理是 `iframe`，而 `iframe` 不能查看嵌套两层 iframe 的页面的效果；

<code-view src="demo.json" style="height:500px;"></code-view>

## 文件包

需要提前定义好文件包的数据；文件包数据为json格式；（以上面案例的文件包json如下；）

```json
{
    "index": "demo.html",
    "sources": [
        "demo.html",
        "code-view.html",
        "code-view.js",
        "code-view.css",
        "demo.json"
    ],
    "view": "demo.html"
}
```

下面解释文件包字段的意义

#### sources

所有相关文件的地址；

数组格式，有顺序结构；

#### index

相关文件中，首先打开文件的地址；

#### view

需要预览的页面的地址；


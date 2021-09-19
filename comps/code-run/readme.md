# code-run

方便查看并预览单个html文件的组件；

支持修改内部代码、新窗口打开和下载网页功能；

## 使用方法

### 引用资源

#### 方法1：script标签引用

先将 ofajs 和 code-run 组件引用到网页；（确保 code-run 在 ofajs 后载入）

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kirakiray/o-book/comps/code-run/code-run.js"></script>
```

#### 方法2：load函数引用

使用 ofajs 模块化系统引用；

```javascript
load("https://cdn.jsdelivr.net/gh/kirakiray/o-book/comps/code-run/code-run.js");
```

### 组件使用

在 `code-run` 标签内使用 `template` 存放需要预览的html内容；

```html
<code-run>
    <template>
        <div style="color:red;">I am text</div>
    </template>
</code-run>
```

预览效果：**（注意，下面这个就是 code-run 生成的，不是文档生成的）**

<code-run>
    <template>
        <div style="color:red;">I am text</div>
    </template>
</code-run>

## 属性

### show-code

添加`show-code`属性，打开代码展示的按钮；

```html
<code-run show-code>
    <template>
        <div style="color:blue;">I am text</div>
    </template>
</code-run>
```

<code-run show-code style="margin-bottom:20px;">
    <template>
        <div style="color:blue;">I am text</div>
    </template>
</code-run>

可将 `show-code` 值设置为 `top`，代码展示将在组件上面展示，并且无法关闭代码展示；

<code-run show-code="top">
    <template>
        <div style="color:black;">I am text</div>
    </template>
</code-run>

### name

当前预览html的文件名；下载和预览文件内 title；

```html
<code-run name="new demo">
    <template>
        <div style="color:green;">I am text</div>
    </template>
</code-run>
```

<code-run name="new demo">
    <template>
        <div style="color:green;">I am text</div>
    </template>
</code-run>

## codehead

可添加 `codehead` 标签来引用资源，`codehead`标签的内容会被塞到新建文件的head内，不会显示在代码展示上；

```html
<code-run name="clickTest" show-code>
    <template>
        <codehead>
            <!-- 新建后会被放到顶部的内容 -->
            <!-- 不会被展示到代码显示上 -->
            <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.js"></script>
        </codehead>
        <div id="consoler">I am consoler</div>
        <button id="btn">Click Me!</button>
        <script>
            $("#btn").on("click", () => {
                $("#consoler").text = "Hello world!";
            });
        </script>
    </template>
</code-run>
```

<code-run name="clickTest" show-code>
    <template>
        <codehead>
            <!-- 新建后会被放到顶部的内容 -->
            <!-- 不会被展示到代码显示上 -->
            <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.js"></script>
        </codehead>
        <div id="consoler">I am consoler</div>
        <button id="btn">Click Me!</button>
        <script>
            $("#btn").on("click", () => {
                $("#consoler").text = "Hello world!";
            });
        </script>
    </template>
</code-run>
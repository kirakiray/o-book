# o-md 组件

## 如何使用

### 方法1：script标签引用

先将 ofajs 和 o-md 组件引用到网页；（确保 o-md 在 ofajs 后载入）

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kirakiray/o-book/comps/o-md/o-md.js"></script>
```

然后直接使用 `<o-md>` 标签，设置src属性，值为文档markdown的地址；

```html
<o-md src="readme.md"></o-md>
```

### 方法2：load函数引用

使用 ofajs 模块化系统引用；

```javascript
load("https://cdn.jsdelivr.net/gh/kirakiray/o-book/comps/o-md/o-md.js");
```

然后直接使用 `o-md`标签；

```html
<o-md src="readme.md"></o-md>
```
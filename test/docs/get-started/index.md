# 上手使用
## 如何使用
### 直接引用

你可以通过 CDN 的地址直接将 ofa.js 引用到你的页面上：

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.2.4/dist/ofa.js"></script>
```

### 通过 npm 安装

首先，在你的项目中安装 ofa.js：

```shell
npm install ofa.js --save
```

然后在项目中引入 ofa.js 模块：

```javascript
import "ofa.js"; // esm
// or
require("ofa.js"); // cmd
```

### 使用

在引用资源后，ofa.js 将在全局作用域上设置一个 `$` 属性，所有的功能都在 `$` 上，后面的教程会详细讲解其用法；

通常情况下，我们建议采用直接引用的方式添加 ofa.js，而使用 npm 的方式则用于与类似 React 和 Vue 等框架进行兼容。
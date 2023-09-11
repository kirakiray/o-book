# 组件的注册参数详解

在 ofa.js 中，你可以在组件模块中定义一些特定的注册参数，以便更灵活地配置组件。下面详细说明了每个注册参数，并附带了相应的示例演示。

## 基础参数

基础参数是注册组件的最基本配置，包含以下几个属性：

### 组件标识

组件模块必须带有 `export const type = $.COMP`，用于标识该模块为组件模块。

示例：

```javascript
// button-component.mjs
export const type = $.COMP;
```

### tag

`tag` 代表注册的组件名。当没有定义 `tag` 属性时，注册的组件名与文件名保持一致。

示例：

```javascript
// button-component.mjs
export const type = $.COMP;
export const tag = "my-button"; // 将组件名注册为 'my-button'
```

### temp

`temp` 是字符串类型的属性，用于定义组件模板的地址。当没有定义 `temp` 时，默认载入和当前模块同目录下与组件同名的 HTML 文件。

示例：

```javascript
// button-component.mjs
export const type = $.COMP;
export const temp = "./my-button-template.html"; // 指定组件模板的地址为 './my-button-template.html'
```

### data

`data` 是对象类型属性，用于生成组件后，默认添加的自定义数据。

示例：

```javascript
// button-component.mjs
export const type = $.COMP;
export const data = {
  count: 0,
};
```

### attrs

`attrs` 是对象类型属性，也属于 `data`，但是这个数据会反映到 element 的 attributes 上，attributes 上的改动也会动态改动到组件的 `data` 上。当出现大写的 key 时，反应到组件 attribute 会变成 `-` 驼峰的命名。

示例：

```javascript
// button-component.mjs
export const type = $.COMP;
export const attrs = {
  buttonText: "Click Me",
};
```

### proto

在组件的注册参数中，你可以添加一个 `proto` 对象，用于定义需要添加到组件原型上的方法。这样，在创建组件的实例时，这些属性和方法就会被添加到实例的原型上，从而所有实例都可以访问和共享这些方法。

```javascript
// MyComponent.js
export const type = $.COMP;

export const data = {
  count: 0,
};

export const proto = {
  sayHello() {
    alert('Hello Count:'+ this.count);
  },
};
```

### watch

`watch` 是对象类型属性，用于监听 `data` 变化的监听函数放在这里。注册成功后，监听的值会被立刻执行一次。

- `watch` 注册的函数在单次线程改动中，只会被触发一次。因此，在一次线程中，即使多次修改这个监听的值，也只会被触发一次。
- 第一个参数为当前值。
- 第二个参数是对象，会带有 `watchers` 数据集，一般情况下 `watchers` 上只会有一个对象，可以从这个对象上获取到 `oldValue`。当单次线程的这个被监听的值被改动过多次，这个数据集会记录多次的变化。

示例：

```javascript
// button-component.mjs
export const type = $.COMP;
export const data = {
  count: 0,
};
export const watch = {
  count(newValue, { watchers }) {
    let oldValue;
    if (watchers) {
      oldValue = watchers[0].oldValue;
    }
    console.log(`count changed from ${oldValue} to ${newValue}`);
  },
};
```

## 示例代码

以下为一个完整的示例代码，包括基础参数的定义和组件模板。

```javascript
// button-component.mjs
export const type = $.COMP;
export const tag = "my-button";
export const temp = "./my-button-template.html";

export const attrs = {
  buttonText: "Click Me",
};

export const data = {
  count: 0,
};

export const watch = {
  count(newValue, { watchers }) {
    let oldValue;
    if (watchers) {
      oldValue = watchers[0].oldValue;
    }
    console.log(`count changed from ${oldValue} to ${newValue}`);
  },
};

export const proto = {
  sayHello() {
    alert("Hello Count:" + this.count);
  },
};
```

```html
<!-- my-button-template.html -->
<style>
  .shadow-button {
    background-color: #6b47fb;
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
</style>

<!-- 使用模板渲染语法，将组件数据渲染成文本 -->
<button class="shadow-button">{{buttonText}} - count:{{count}}</button>
```

```html
<!-- demo.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>my-button</title>
    <script src="../ofa.js"></script>
    <l-m src="./button-component.mjs"></l-m>
  </head>
  <body>
    <my-button button-text="My Button"></my-button>
    <script>
      $("my-button").on("click", () => {
        $("my-button").count++;
      });

      setTimeout(() => {
        $("my-button").sayHello();
      }, 1000);
    </script>
  </body>
</html>

```

### default

你还可以使用异步函数来定义 `default` 数据，以便动态地返回组件的注册参数。

函数的 `function` 会带来一个对象，包含

 `load`、`url` 和 `query`：

- `load` 方法是异步加载函数，使用方法和异步 `import` 加载一致，可以通过 `const data = await load(xxx)` 加载异步模块。
- 通过 `load` 加载的模块，会有和 `load-module` 加载一样的效果。`load` 方法相当于 `load-module` 组件的函数版，具体使用方法可以查阅[https://github.com/kirakiray/drill.js](https://github.com/kirakiray/drill.js)的文档。
- `url` 是当前模块的文件名。
- `query` 是加载这个模块时的 URL 参数转成的对象。

以下是使用 `default` 的示例：

```javascript
// button-component.mjs
export const type = $.COMP; // 这个必须优先定义，不能作为动态参数
export const tag = "my-button";
export const temp = "./my-button-template.html";

export default async function ({ load, url, query }) {
  console.log("url:", url); // 输出当前模块的文件名
  console.log("query:", query); // 输出当前模块的 URL 参数转成的对象

  const asyncData = await load("./async-data.mjs"); // 使用 load 异步加载模块
  console.log("asyncData:", asyncData); // 输出异步加载的模块数据

  return {
    data: {
      count: 0,
    },
    attrs: {
      buttonText: "Click Me",
    },
    watch: {
      count(newValue, { watchers }) {
        let oldValue;
        if (watchers) {
          oldValue = watchers[0].oldValue;
        }
        console.log(`count changed from ${oldValue} to ${newValue}`);
      },
    },
    proto: {
      sayHello() {
        alert("Hello Count:" + this.count);
      },
    },
  };
}
```

在这个示例中，我们演示了如何使用 ofa.js 的注册参数来定制化组件的行为。通过合理地配置这些参数，你可以更好地适应不同的组件需求，实现更灵活的组件开发。

写一下 组件的注册参数 的 proto 使用文档
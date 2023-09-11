# 组件的生命周期

在 ofa.js 中，组件生命周期是在特定时间点触发的钩子函数。这些钩子函数让你能更精细地控制和交互，ofa.js 有五个关键生命周期钩子：`created`、`ready`、`watch`、`loaded`、`attached` 和 `detached`，分别在不同时刻触发。

## 生命周期钩子

### created

`created` 生命周期钩子在组件创建时被触发。在此阶段，组件的数据尚未被初始化，模板内容也未被渲染。你可以在这个阶段执行一些初始化操作，或者准备在后续阶段使用的数据。

### ready

`ready` 生命周期钩子会在组件的数据和模板刚被初始化后触发，表示组件已经准备就绪。在这个阶段，你可以访问组件的数据，并且模板已经渲染完成，可以执行一些与界面交互相关的操作。

如果组件模板存在对其他组件的依赖，这个阶段不会等待依赖加载完成。因此，这个阶段适合为组件添加Loading样式，但需要注意等待依赖加载完成后再执行相关操作。

### watch

一旦 `ready` 阶段完成，与之关联的 `watch` 对象中的监听函数会被触发一次。随后，当数据的某个值发生变动时，会再次触发相应键（key）的监听函数。

### loaded

`loaded` 生命周期钩子在组件模板内的所有依赖都加载完成后触发。这个阶段确保在渲染组件之前，所有的依赖都已经加载完毕。这个时候适合去除在 `ready` 阶段添加的Loading样式。

### attached

`attached` 生命周期钩子会在组件被添加到文档中时触发。在这个阶段，适合获取组件内元素的尺寸相关信息，进行数据绑定和全局事件的操作。

### detached

`detached` 生命周期钩子会在组件从文档中移除时触发。在这个阶段，你可以执行一些清理操作，比如取消事件监听或者释放资源，以防止内存泄漏。

## 示例演示

以下是一个示例，展示了如何使用这些生命周期钩子：

```javascript
// lifecycle-demo.mjs
export const type = $.COMP;
export const tag = "lifecycle-demo";
export const temp = "./lifecycle-demo-template.html";

export default async function () {
  return {
    data: {
      count: 0,
    },
    watch: {
      count(count) {
        console.log("count: ", count);
      },
    },
    created() {
      console.log("created: Component created, data not initialized.");
    },
    ready() {
      console.log(
        "ready: Component is ready with initialized data and template."
      );

      this.on("click", () => {
        this.count++;
      });
    },
    attached() {
      console.log("attached: Component attached to DOM.");
    },
    detached() {
      console.log("detached: Component detached from DOM.");
    },
  };
}

```

```html
<!-- lifecycle-demo-template.html -->
<l-m src="../simple-button/simple-button.mjs"></l-m>
<simple-button>Click Me ({{count}})</simple-button>
```

```html
<!-- lifecycle-demo.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lifecycle Demo</title>
    <script src="../ofa.js"></script>
    <l-m src="./lifecycle-demo.mjs"></l-m>
  </head>
  <body>
    <lifecycle-demo></lifecycle-demo>
  </body>
</html>
```

在上面的示例中，我们定义了一个名为 `lifecycle-demo` 的组件，并且在其模板中放置了一个按钮。通过不同的生命周期钩子，我们可以在控制台中观察到各个阶段触发的日志。

## 生命周期流程图

<img src="../../../publics/life-cycle.png" width="512" />

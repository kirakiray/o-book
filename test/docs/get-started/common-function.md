# 常用方法

## attr

`attr` 方法允许您获取或设置元素的属性。

```html
<div id="example" name="i am hello word">Hello World</div>
<script>
    const $div = $('#example');
    console.log($div.attr('name')); // 输出: "i am hello word"
    $div.attr('title', "change title");
</script>
```

在上面的示例中，我们首先选择了一个具有 `id` 为 "example" 的 `div` 元素。然后，我们使用 `attr` 方法来获取该元素的 `name` 属性，并将其打印到控制台。接下来，我们使用 `attr` 方法来设置该元素的 `title` 属性为 "change title"。
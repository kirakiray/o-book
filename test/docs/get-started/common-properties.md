# 常用属性

在 `$` 实例中，除了可以通过选择器选择元素外，还提供了一些常用的属性来方便元素的操作和查找。

## tag 属性

`tag` 属性用于获取当前元素的标签名（小写形式），类似于 DOM 元素的 `tagName` 属性。

```html
<div id="example">Hello World</div>
<script>
    const $div = $('#example');
    console.log($div.tag); // Output: "div"
</script>
```


## ele 属性

`ele` 属性用于获取 `$` 实例的实际 DOM 元素，从而可以对该元素进行原生的 JavaScript 操作。

```html
<div id="example">Hello World</div>
<script>
    const $div = $('#example');
    const actualElement = $div.ele;
    actualElement.style.color = "red"; // Change text color to red
</script>
```


## index 属性

`index` 属性用于获取当前元素在同级元素中的排名索引，从 0 开始计数。

```html
<div>
    <span>First</span>
    <span>Second</span>
    <span id="target">Third</span>
</div>
<script>
    const $targetSpan = $('#target');
    console.log($targetSpan.index); // Output: 2
</script>
```


## parent 和 parents 属性 

- `parent` 属性用于获取当前元素的直接父元素。 
- `parents` 属性用于获取当前元素的所有祖先元素（包括父元素的父元素、父元素的父元素的父元素等）构成的数组。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parent and Parents Attributes</title>
  <script src="../ofa.js"></script>
</head>
<body>
  <div>
    <span>
      <a id="example">Hello World</a>
    </span>
  </div>
  <script>
    const $a = $('#example');

    const $parentSpan = $a.parent;
    console.log($parentSpan.tag); // Output: "span"

    const $parentsArray = $a.parents;
    console.log($parentsArray.map($ele => $ele.tag)); // Output: ["span", "div", "body", "html"]
  </script>
</body>
</html>
```


## next、nexts、prev、prevs、siblings 属性 

- `next` 属性用于获取当前元素的下一个兄弟元素。 
- `nexts` 属性用于获取当前元素后面的所有兄弟元素构成的数组。 
- `prev` 属性用于获取当前元素的前一个兄弟元素。 
- `prevs` 属性用于获取当前元素前面的所有兄弟元素构成的数组。 
- `siblings` 属性用于获取当前元素的所有兄弟元素，不包括自己。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Siblings Attributes</title>
  <script src="../ofa.js"></script>
</head>
<body>
  <div>
    <span>Zero</span>
    <span>First</span>
    <span id="example">Second</span>
    <span>Third</span>
    <span>Four</span>
  </div>
  <script>
    const $span = $('#example');

    const $nextSibling = $span.next;
    console.log($nextSibling.tag); // Output: "span"

    const $nextSiblingsArray = $span.nexts;
    console.log($nextSiblingsArray.map($ele => $ele.text)) // Output: ["Third", "Four"]

    const $prevSibling = $span.prev;
    console.log($prevSibling.tag); // Output: "span"

    const $prevSiblingsArray = $span.prevs;
    console.log($prevSiblingsArray.map($ele => $ele.text)) // Output: ["Zero", "First"]

    const $siblings = $span.siblings;
    console.log($siblings.map($ele => $ele.text)) // Output: ["Zero", "First", "Third", "Four"]
  </script>
</body>
</html>
```
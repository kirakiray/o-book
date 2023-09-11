# 实例的基础概念

`$` 实例是对页面上元素的封装，除了用于选择现有的元素外，它还可以直接创建新元素并进行操作。在本章中，我们将介绍如何创建新元素以及对 `$` 实例的一些操作。

## 创建新元素

通过 `$` 实例，我们可以直接创建新的元素并进行操作，例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create New Element</title>
  <script src="../ofa.js"></script>
</head>
<body>
  <script>
    const $ele = $('<div style="color:red">I am text</div>');
    $('body').push($ele);
  </script>
</body>
</html>
```

在上面的例子中，我们通过 `$('<div style="color:red">I am text</div>')` 创建了一个新的 `div` 元素，并将其添加到了 `body` 中。

## 获取子元素

通过 `$` 获取的实例，并不像 DOM 元素那样拥有 `children` 属性。但是我们可以通过数组索引来访问实例的直接子元素：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Child Elements</title>
  <script src="../ofa.js"></script>
</head>
<body>
  <div>
    <p>First Paragraph</p>
    <p>Second Paragraph</p>
  </div>
  <script>
    const $div = $('div');
    console.log($div[0]); // Output: <p>First Paragraph</p>
    console.log($div[1]); // Output: <p>Second Paragraph</p>
    console.log($div.length); // Output: 2
  </script>
</body>
</html>
```

在上面的例子中，我们获取了 `div` 元素，并通过索引来访问第一个和第二个 `p` 元素。同时，我们还使用了 `$div.length` 获取了子元素的数量。

## 操作子元素

通过 `$` 实例，我们还可以直接使用数组的方法来操作子元素，例如 `push` 和 `pop`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manipulate Child Elements</title>
  <script src="../ofa.js"></script>
</head>
<body>
  <div>
    <p>First Paragraph</p>
  </div>
  <script>
    const $paragraphs = $('p');
    
    // 添加新的 div 元素作为子元素
    const $newDiv = $('<div>New Div</div>');
    $paragraphs.push($newDiv);

    setTimeout(()=>{
      // 删除最后一个子元素
      $paragraphs.pop();

      console.log($paragraphs);
    },1000)

  </script>
</body>
</html>
```

在上面的例子中，我们获取了所有 `p` 元素的 `$` 实例，并使用 `push` 方法添加了一个新的 `div` 元素作为子元素，然后使用 `pop` 方法移除了最后一个子元素。

通过上述示例，你可以了解 `$` 实例的一些基本操作，包括创建新元素和对子元素的访问与操作。 `$` 实例提供了简便的方法来操作页面上的元素。



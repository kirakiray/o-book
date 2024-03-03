# Add analysis code

If you need to track and analyze the visitor data of your website, we recommend using [Google Analytics](https://analytics.google.com).

To add analytics code, please follow these steps:

1. Open the `_preview.html` file with your code editor.

2. Add a `<template>` tag with the `inject-head` attribute inside the `<book-tool>` tag, and place your tracking code within the template, similar to the following example:

```html
<book-tool sw="./doc-sw.js">
   <source src="./cn/config.json" lang="cn" />
   <template inject-head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-xxxxxxxxxx"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-xxxxxxxxxx');
        </script>
   </template>
</book-tool>
```

Once you have added the analytical code, please repackage the project. The analytical code will be inserted into the header of all pages, allowing you to easily track and analyze the traffic data of your website.
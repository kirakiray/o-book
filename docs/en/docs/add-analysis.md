# Add analysis code

If you need to track and analyze the visit data of your website, we recommend using Google Analytics.

To add analytical code, please follow the steps below:

1. Open the `_preview.html` file using your code editor.
2. Add a `<template>` tag within the `<book-tool>` tag with the `inject-head` attribute, and place your tracking code inside the template, similar to the following example:

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

Once you have added the analytics code, please repackage the project. The analytics code will be inserted into the header of all pages so that you can easily track and analyze the access data of your website.


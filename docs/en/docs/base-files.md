# Basic Files

The basic files are equivalent to the scaffold for `o-book`, which is necessary to preview and build the project. They are indirectly related to your Markdown website, and the packaged files will not include these basic files. If you are not a developer or do not care about the details of the scaffold, you can skip this chapter and go directly to [project files](./project-docs.md).

`o-book` has two main foundational files: `sw.js` and `_preview.html`.

### sw.js



```javascript
// sw.js
importScripts(`https://cdn.jsdelivr.net/npm/obook@2.1.38/src/sw/base.js`);
```

### _preview.html

`_preview.html` is the file that initializes the project preview. The main code is as follows:

```html
<!-- Loaded the book-tool component using l-m -->
<l-m src="https://cdn.jsdelivr.net/npm/obook@2.1.38/src/book-tool.html"></l-m>
<!-- Referenced the sw.js file mentioned above using the sw attribute. If the name of sw.js changes, it should be updated here as well -->
<book-tool sw="./sw.js">
    <!-- References to your project configuration files -->
    <source src="./en/config.json" lang="en" />
    <source src="./cn/config.json" lang="cn" />
</book-tool>
```

In the above content, the `source` refers to the location of the **project configuration file**, and the **project file** will be discussed in the next chapter. The `lang` attribute is used to set the default language used by the document site. By default, `obook` supports multiple languages. If you do not need multi-language support, you can keep only one `source`.

Currently, the official language packages supported by `o-book` include:
- **en** English
- **cn** Simplified Chinese
- **t-cn** Traditional Chinese
- **es** Spanish
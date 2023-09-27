# Basic Files

The base files are equivalent to the scaffolding for `o-book` startup. They serve as the foundation for previewing and packaging your project. They are indirectly related to your Markdown website, and the packaged files will not include these base files. If you are not a developer or do not care about the details of the scaffolding, you can skip this chapter and go directly to [Project Files](./project-docs.md).

The most important basic files of `o-book` are `sw.js` and `_preview.html`.

### sw.js

`sw.js` is one of the basic files with only one line of code, which is used to initialize the official file. It does not require much attention.

```javascript
// sw.js
importScripts(`https://cdn.jsdelivr.net/npm/obook@2.1.15/src/sw/base.js`);
```

### _preview.html

`_preview.html` is the file that initializes the project preview. The main code is as follows:

```html
<!-- Load the book-tool component via l-m -->
<l-m src="https://cdn.jsdelivr.net/npm/obook@2.1.0/src/book-tool.html"></l-m>
<!-- Reference the sw.js file mentioned above using the sw property. If the name of sw.js is changed, it should be updated here as well. -->
<book-tool sw="./sw.js">
    <!-- Reference your project's configuration files -->
    <source src="./en/config.json" lang="en" />
    <source src="./cn/config.json" lang="cn" />
</book-tool>
```

Among them, `source` refers to the location of the **project configuration file**, and **project files** will be discussed in the next chapter. `lang` attribute is used to set the default language used by the document station. `obook` supports multiple languages by default. If multiple language support is not needed, only one `source` needs to be kept.

Currently, the official `o-book` supports languages including:

- **en** English
- **cn** Simplified Chinese
- **t-cn** Traditional Chinese
- **es** Spanish


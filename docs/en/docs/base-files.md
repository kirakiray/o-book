# Basic Files

The basic files are equivalent to the scaffold for starting the `o-book` and are required as a foundation for previewing and packaging projects. They are indirectly related to your Markdown website, and the packaged files will not include these basic files. If you are not a developer or do not care about the details of the scaffold, you can skip this section and directly view the [project files](./project-docs.md).

The most important fundamental files for `o-book` are `sw.js` and `_preview.html`.

### sw.js

`sw.js` is one of the foundational files and only contains one line of code. Its content initializes the reference to the official file, so there is no need to pay too much attention to it.

```javascript
// sw.js
importScripts(`https://cdn.jsdelivr.net/npm/obook@2.1.23/src/sw/base.js`);
```


### _preview.html

`_preview.html` is the file for initializing project preview, and the main code is as follows:

```html
<!-- Loaded the book-tool component using l-m -->
<l-m src="https://cdn.jsdelivr.net/npm/obook@2.1.23/src/book-tool.html"></l-m>
<!-- Referencing the sw.js file mentioned above using the sw attribute. If the sw.js file is renamed, it needs to be updated here as well -->
<book-tool sw="./sw.js">
    <!-- Referencing your project configuration files -->
    <source src="./en/config.json" lang="en" />
    <source src="./cn/config.json" lang="cn" />
</book-tool>
```

In , the `source` refers to the location of the **project configuration file**, and the **project file** will be discussed in the next chapter. The `lang` attribute is used to set the default language used by the documentation site. By default,  supports multiple languages. If multi-language support is not needed, only one `source` should be retained.

Currently, the officially supported languages for `o-book` include:
- **en** English
- **cn** Simplified Chinese
- **t-cn** Traditional Chinese
- **es** Spanish
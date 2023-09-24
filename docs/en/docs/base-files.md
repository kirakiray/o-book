# Basic Document

The basic files are equivalent to the scaffold for starting the o-book. They are necessary to preview and package the project. They are indirectly related to your Markdown website, and the packaged files will not include these basic files. If you are not a developer or don't care about the details of the scaffold, you can skip this chapter and directly view the [project files](./project-docs.md).

The most important foundational files for `o-book` are two, namely `sw.js` and `_preview.html`.

### sw.js

`sw.js` is one of the base files with only one line of code. Its content is to reference the official file for initialization, so it does not require much attention.

// sw.js
importScripts(`https://cdn.jsdelivr.net/npm/obook@2.1.9/src/sw/base.js`);

### _preview.html

`_preview.html` is the file used for project startup preview initialization. The main code is as follows:

<!-- The book-tool component is loaded using l-m -->
<l-m src="https://cdn.jsdelivr.net/npm/obook@2.1.0/src/book-tool.html"></l-m>
<!-- The sw attribute is used to reference the sw.js file mentioned above. If the sw.js file is renamed, it needs to be replaced here as well -->
<book-tool sw="./sw.js">
    <!-- References your project configuration file -->
    <source src="./en/config.json" lang="en" />
    <source src="./cn/config.json" lang="cn" />
</book-tool>

Where `source` refers to the address of the **project configuration file**, the **project file** will be discussed in the next chapter. The `lang` attribute is used to set the default language used by the document station. `obook` supports multiple languages by default, if multiple language support is not required, only one `source` should be kept.

Currently, the official supported languages for `o-book` include:

- **en** English
- **cn** Simplified Chinese
- **t-cn** Traditional Chinese
- **es** Spanish


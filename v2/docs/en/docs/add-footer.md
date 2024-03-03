# Add bottom content

You can define the content displayed at the bottom of all pages by editing the `footer` property in the `config.json` file. In the `footer` property, specify a relative path to reference the Markdown file that contains the footer content.

```json
// config.json
{
  ...
  "footer": "./footer.md"
  ...
}
```

Similar to the content in `SUMMARY.md`, the `footer.md` file includes a list of links that will be displayed at the bottom of the page. Here is an example of the content in the `footer.md` file:

```markdown
<!-- footer.md -->
- <img src="../publics/logo.svg" /> obook
  - ©2023
- Documentation
  - [Introduction](./docs/index.md)
  - [Introduction to Base Files](./docs/base-files.md)
  - [Introduction to Project Documents](./docs/project-docs.md)
- About ofa.js
  - [ofa.js Official Website](https://ofajs.com/)
  - [Creating Components](https://ofajs.com/en/cases/simple-component.html)
```

If your document supports multiple languages, the bottom content will also include entry links for the different language versions for user selection.

In the `footer.md` file, you can also add images that will be displayed as icons at the bottom. This way, you can easily add custom footer content to your documentation site.
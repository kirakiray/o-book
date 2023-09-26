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

Similar to the content of `SUMMARY.md`, the `footer.md` file contains a list of links that will be displayed at the bottom of the page. Below is an example of the content of the `footer.md` file:

```markdown
<!-- footer.md -->
- <img src="../publics/logo.svg" /> obook
  - ©2023
- Documentation
  - [Introduction](./docs/index.md)
  - [Introduction to Basic Files](./docs/base-files.md)
  - [Introduction to Project Files](./docs/project-docs.md)
- About ofa.js
  - [ofa.js Official Website](https://ofajs.com/)
  - [Creating Components](https://ofajs.com/en/cases/simple-component.html)
```

In the `footer.md` file, you can also add images, which will be displayed as icons at the bottom. This way, you can easily add custom footer content to your documentation site.


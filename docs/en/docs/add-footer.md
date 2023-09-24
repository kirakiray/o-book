# Add footer content

You can define the content displayed at the bottom of all pages by editing the `footer` attribute in the `config.json` file. In the `footer` attribute, specify a relative path to reference a Markdown file containing the footer content.

```json
// config.json
{
  ...
  "footer": "./footer.md"
  ...
}
```
Note: The text inside the JSON document does not require translation as it is written in English.

Similar to the content of `SUMMARY.md`, the `footer.md` file contains a list of links that will be displayed at the bottom of the page. Below is an example of the content of the `footer.md` file:

```markdown
<!-- footer.md -->
- <img src="../publics/logo.svg" /> obook
  - ©2023
- Documentation
  - [Introduction](./docs/index.md)
  - [Introduction to Base Files](./docs/base-files.md)
  - [Introduction to Project Files](./docs/project-docs.md)
- About ofa.js
  - [ofa.js Official Website](https://ofajs.com/)
  - [Creating Components](https://ofajs.com/en/cases/simple-component.html)
```

In the `footer.md` file, you can also add images, which will be displayed as icons at the bottom. This way, you can easily add custom footer content to your document site.


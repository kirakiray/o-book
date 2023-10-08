# Project Files

The project files are the files where you actually write your documents. The project directory structure is roughly as follows:

- **config.json**
- docs
  - **SUMMARY.md**
  - *article1.md*
  - *article2.md*

In this structure, `.md` files are the files where you actually write the content of your document, and you just need to write the document in Markdown format.

## config.json

`config.json` is the configuration file for the document site, which is used to configure the top navigation and other settings. The `navs` property is used to configure the navigation bar, where the `summary` property corresponds to the `SUMMARY.md` file path mentioned below. You can configure multiple navigation options.

```json
{
  "navs": [
    {
      "name": "Documentation",
      "summary": "./docs/SUMMARY.md"
    },
    // {
    //   "name": "Nav Name",
    //   "summary": "./folder/SUMMARY.md"
    // }
  ]
}
```

## SUMMARY.md

The format of SUMMARY.md is a simple list of links. The name of the links is the name of the chapter, and the target of the links is the path to the chapter file, which will be displayed on the left side of the document site.

For example, the information in the current document site's `SUMMARY.md` is as follows:

```md
- [Introduction](./index.md)
- Start Project
  - [Standard mode](./run-mode/base-mode.md)
  - [Command line mode](./run-mode/cli-mode.md)
  - [Web application mode](./run-mode/webapp-mode.md)
- [Base files](./base-files.md)
- [Project files](./project-docs.md)
```

These project files are a crucial part of building a documentation site. They will help you organize and showcase your documentation content. Please follow the above structure and format to write your documentation.
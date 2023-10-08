# Project Files

The project files are the files where you actually write the documentation. The project directory structure is roughly as follows:

- **config.json**
- docs
  - **SUMMARY.md**
  - *article1.md*
  - *article2.md*

In this structure, `.md` files are the files where you actually write the content of the document. You only need to write the document in Markdown format.

## config.json

`config.json` is the configuration file for the documentation site, used to configure the top navigation and other settings. The `navs` property is used to configure the navigation bar, where the `summary` property corresponds to the `SUMMARY.md` file path mentioned below. You can configure multiple navigation options.

```json
{
  "navs": [
    {
      "name": "User Documentation",
      "summary": "./docs/SUMMARY.md"
    },
    // {
    //   "name": "Navigation Name",
    //   "summary": "./folder/SUMMARY.md"
    // }
  ]
}
```

## SUMMARY.md

The format of SUMMARY.md is a simple list of links. The name of the link is the name of the chapter, and the link points to the path of the chapter file, which will be displayed on the left side of the document site.

For example, the `SUMMARY.md` information of the current document site is as follows:

- [Introduction](./index.md)
- Start the project
  - [Standard mode](./run-mode/base-mode.md)
  - [Command-line mode](./run-mode/cli-mode.md)
  - [Web application mode](./run-mode/webapp-mode.md)
- [Base files](./base-files.md)
- [Project files](./project-docs.md)

These project files are crucial to building a documentation site as they will help you organize and showcase your document content. Please follow the above structure and format to write your documentation.
# Project Files

The project files are the files where you actually write documents. The project directory structure is roughly as follows:

- **config.json**
- docs
  - **SUMMARY.md**
  - *article1.md*
  - *article2.md*

In this structure, the `.md` file is the file where you actually write the content of the document, and you just need to write the document in Markdown format.

## config.json

`config.json` is the configuration file for the document site, used to configure the top navigation and other settings. The `navs` attribute is used to configure the navigation bar, and the `summary` attribute corresponds to the `SUMMARY.md` file path mentioned below. You can configure multiple navigation options.

```json
{
  "navs": [
    {
      "name": "使用文档",
      "summary": "./docs/SUMMARY.md"
    },
    // {
    //   "name": "导航名",
    //   "summary": "./folder/SUMMARY.md"
    // }
  ]
}
```

## SUMMARY.md

The format of SUMMARY.md is a simple list of links. The name of the link is the name of the chapter, and the target of the link is the path of the chapter file, which will be displayed on the left side of the documentation site.

For example, the information of the `SUMMARY.md` file of the current document site is as follows:

```md
- [Introduction](./index.md)
- Start the Project
  - [Standard Mode](./run-mode/base-mode.md)
  - [Command Line Mode](./run-mode/cli-mode.md)
  - [Web Application Mode](./run-mode/webapp-mode.md)
- [Base Files](./base-files.md)
- [Project Documentation](./project-docs.md)
```

These project files are crucial to building a documentation site, as they will help you organize and showcase your document content. Please write your document following the above structure and format.


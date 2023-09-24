# Project Documents

The project document is the file where you actually write the documentation. The project directory structure is roughly as follows:

- **config.json**
- docs
  - **SUMMARY.md**
  - *article1.md*
  - *article2.md*

In this structure, the `.md` file is the file where you actually write the content of the document. You just need to write the document in Markdown format.

## config.json

{
    "version": "1.0",
    "name": "My App",
    "environment": "development",
    "apiUrl": "https://api.example.com",
    "apiKey": "abcdefgh12345678",
    "debugMode": true
}

`config.json` is the configuration file for the document site. It is used to configure the top navigation and other settings. The `navs` property is used to configure the navigation bar, where the `summary` property corresponds to the path of the `SUMMARY.md` file mentioned below. You can configure multiple navigation options.

{
  "navs": [
    {
      "name": "Documentation",
      "summary": "./docs/SUMMARY.md"
    },
    // {
    //   "name": "Navigation Name",
    //   "summary": "./folder/SUMMARY.md"
    // }
  ]
}

This document provides a summary of the content of the repository.

## Introduction

The repository contains various files and documents related to our project. In this summary, we will briefly describe the purpose and structure of each file.

## File Structure

Here is an overview of the file structure:

- **README.md**: This file provides general information about the project.
- **src**: This folder contains all the source code files.
- **docs**: This folder contains all the documentation files.
- **data**: This folder contains all the data files used in the project.

## File Descriptions

- `file1.js`: This file contains the implementation of a function that performs a specific task.
- `file2.py`: This file is a Python script that generates a report based on the data provided.
- `document1.md`: This document provides detailed information about the project requirements.
- `document2.md`: This document describes the testing methodology used in the project.
- `data.csv`: This file contains the raw data used for analysis.

## Conclusion

This summary provides an overview of the file structure and descriptions of the main files in the repository. For more detailed information, please refer to the individual files and documents.

The format of SUMMARY.md is a simple list of links. The names of the links are the names of the chapters, and the links point to the paths of the chapter files, which will be displayed on the left side of the document website.

For example, the information of the current document site's `SUMMARY.md` is as follows:

```md
- [Introduction](./index.md)
- Start the project
  - [Standard mode](./run-mode/base-mode.md)
  - [Command line mode](./run-mode/cli-mode.md)
  - [Web application mode](./run-mode/webapp-mode.md)
- [Base files](./base-files.md)
- [Project documentation](./project-docs.md)
```

These project files are the key part of building the document site, and they will help you organize and showcase your document content. Please write your documents following the above structure and format.


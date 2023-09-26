# o-book 2

o-book 2 is a documentation generation tool that will be one of the simplest document site generation tools you have ever used. With just one HTML file, you can generate a fully functional document website from the Markdown articles you have written. It is developed based on [ofa.js] (https://ofajs.com/) and is very easy to use.

## Preparation before use

Before using o-book, you need to master the basic syntax of [Markdown](https://www.google.com/search?q=markdown). In addition, you also need to prepare a text editor. We recommend using [VSCode](https://code.visualstudio.com/) launched by Microsoft. It is not only free, but also has a large number of extensions to choose from, making your document editing work more efficient.

## Prepare Files

Before writing the document, you need to prepare the basic files of the project locally. For convenience, we have provided you with the initial files of the project. Just click on the following link to download and unzip them to your local machine:
[Download project file](../../publics/stand-up.zip)

Later on, we will explain the meaning of a few key files;

## Run the project

obook provides three ways to run your project. You can start it by **choosing one of the following ways** according to your needs:

1. **Standard Mode**: Use a local server to view o-book components, allowing for previewing and generating documentation sites.
2. **Command Line Mode**: Use Node.js and the command line to preview and generate documentation sites.
3. **Web Application Mode**: Select a local Markdown folder directly through a web page for previewing and generating.

[Standard mode](./run-mode/base-mode.md) requires a static server to open the downloaded file;

[Command-line mode](./run-mode/cli-mode.md) requires a certain foundation of front-end development knowledge. Install the `o-book` module through `npm`, and then you can use the command line to preview and package projects. This mode can also be a part of script automation.

[Web application mode](./run-mode/webapp-mode.md) does not require any development knowledge. Simply open the website, select a local folder, and you can view and package your project;


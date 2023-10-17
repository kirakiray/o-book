# o-book 2

o-book 2 is a documentation generation tool that will be one of the easiest documentation site generators you have ever used. With just one HTML file, you can turn your Markdown articles into fully functional document websites. It is developed based on [ofa.js](https://ofajs.com/) and is very easy to use;

## Preparation before use

Before using o-book, you need to master the basic syntax of [Markdown](https://www.google.com/search?q=markdown). In addition, you need to have a text editor ready. We recommend using [VSCode](https://code.visualstudio.com/) developed by Microsoft, which is not only free but also has a wide range of extensions to choose from, making your document editing work more efficient.

## Prepare Files

Before writing the document, you need to prepare the basic files of the project locally. For your convenience, we have provided the initial files of the project for you. Just click on the following link to download and unzip them to your local machine:



[Download project files](../../publics/stand-up.zip)

Later, we will explain the meanings of several key files;

## Running the Project

The official obook provides three ways to run your project. You can choose one of them **according to your needs** and start it:

1. **Standard Mode**: Use a local server to view the o-book component and preview and generate the documentation site.
2. **Command-line mode**: Use Node.js and the command line to preview and generate the documentation site.
3. **Web application mode**: Preview and generate by directly selecting a local Markdown folder through a web page.

[Standard Mode](./run-mode/base-mode.md) requires a static web server to open the downloaded files.

[Command Line Mode](./run-mode/cli-mode.md) requires a certain foundation of frontend development knowledge. After installing the `o-book` module through `npm`, you can use the command line to preview and build projects. This mode can also be integrated into script automation.

[Web Application Mode](./run-mode/webapp-mode.md) does not require any development knowledge. You just need to open the website and select a local folder to view and package your project.
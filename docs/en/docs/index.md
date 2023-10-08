# O-Book 2

o-book 2 is a document generation tool that will be one of the simplest document site generation tools you have ever used. With just one HTML file, you can generate a fully functional document website from your written Markdown articles. It is developed based on [ofa.js](https://ofajs.com/) and is very easy to use.

## Preparations before use

Before using o-book, you need to have a good understanding of the basic syntax of [Markdown](https://www.google.com/search?q=markdown). Additionally, you will need a text editor. We recommend using [VSCode](https://code.visualstudio.com/), which is not only free, but also has a wide range of extensions available for you to choose from, making your document editing work more efficient.

## Prepare Files

Before writing the document, you need to prepare the basic files of the project locally. For your convenience, we have provided you with the initial files of the project. You only need to click on the following link to download and extract them to your local directory:

[Download project files](../../publics/stand-up.zip)

We will explain the meanings of several key files below.

## Running the Project

There are three ways provided by 's official website to run your project. You can choose one of them according to your needs and start it:

1. **Standard Mode**: Use a local server to view the o-book component, allowing for previewing and generating documentation sites.
2. **Command Line Mode**: Use Node.js and the command line to preview and generate documentation sites.
3. **Web Application Mode**: Preview and generate by directly selecting a local Markdown folder through a web page.

The [Standard Mode](./run-mode/base-mode.md) requires a static server to open the downloaded file.

You must have a certain foundation of front-end development knowledge in order to use [Command Line Mode](./run-mode/cli-mode.md). Install the `o-book` module using `npm`, and then you can use the command line to preview and package the project. This mode can also be part of script automation.

[Web Application Mode](./run-mode/webapp-mode.md) does not require any development knowledge. All you need to do is open the website, choose a local folder, and you can view and package your project. 
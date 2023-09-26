# Command Line Mode

Command line mode is started by using the `obook` command to launch your project, requiring a certain foundation of development knowledge. The following is the usage process:
```

1. Make sure that `Node.js` is installed on your system and that the version is greater than or equal to 18.

2. Use the command `npm i obook -g` in the command line to install `o-book` on your local machine.

3. After downloading the project files, make sure that the `package.json` file in the root directory of the project is configured with the `obook` property as shown below:
```

```json
{
  "obook": {
    "input": "./_preview.html", // The address of the project component preview page
    "output": "./dist", // The output directory of the packaging
    "port": 44038 // The port number of the preview web page, please ensure that the port number does not conflict with other services
  }
}
```

4. In the terminal, navigate to the current project directory, and use the `obook dev` command to preview in real-time.

## How to package

In the same mode, use the `obook build` command to package the project to the `dist` directory defined in `package.json`.

Next, you can directly access the [base file](../base-files.md) section for more information.


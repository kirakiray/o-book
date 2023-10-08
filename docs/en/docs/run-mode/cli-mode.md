# Command Line Mode

The command line mode is started by using the `obook` command to initiate your project and requires a certain foundation of development knowledge. The process is as follows:

1. Make sure that `Node.js` is installed on your system and ensure that the version is greater than or equal to 18.

2. Use the command `npm i obook -g` in the command line to install `o-book` on your local machine.

3. After downloading the project files, ensure that the `package.json` file in the root directory of the project is configured with the `obook` attribute as shown below:


```json
{
  "obook": {
    "input": "./_preview.html", // Address of the project component preview page
    "output": "./dist", // Output directory for packaging
    "port": 44038  // Port number for preview web page, please ensure that the port number does not conflict with other services
  }
}
```

4. Switch to the current project directory in the terminal and use the `obook dev` command to preview it in real time. 

## How to package

In the same pattern, use the `obook build` command to package the project into the `dist` directory defined in `package.json`.

Next, you can directly go to the [Base Files](../base-files.md) section to view more information.

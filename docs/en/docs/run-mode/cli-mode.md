# Command Line Mode

Command-line mode is used to start your project by using the `obook` command, and it requires a certain level of development knowledge. The following is the usage process:

1. Ensure that the system has `Node.js` installed and that the version is greater than or equal to 18.

2. Install `o-book` on your local machine by using the command `npm i obook -g` in the command line.

3. After downloading the project files, make sure that the `package.json` file in the root directory of the project is configured with the `obook` property as shown below:

```json
{
  "obook": {
    "input": "./_preview.html", // Address of the project component preview page
    "output": "./dist", // Output directory for packaging
    "port": 44038  // Port number for previewing web pages, please make sure the port number does not conflict with other services
  }
}
```

4. Switch to the current project directory in the terminal and use the `obook dev` command for real-time preview.

## How to package

In the same mode, use the `obook build` command to package the project to the `dist` directory defined in `package.json`.

Next, you can directly go to the [base files](../base-files.md) section for more information.

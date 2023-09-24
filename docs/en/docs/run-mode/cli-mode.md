# Command Line Mode

Command line mode is used to start your project by using the `obook` command and requires a certain foundation of development knowledge. The following are the steps to follow:

1. Make sure that the system has `Node.js` installed and ensure that the version is greater than or equal to 18.

2. Use the command `npm i obook -g` in the command line to install `o-book` onto your local machine.

3. After downloading the project files, make sure that the `package.json` file in the root directory of the project is configured with the `obook` property, as shown below:

{
  "obook": {
    "input": "./_preview.html",
    "output": "./dist",
    "port": 44038
  }
}

4. Switch to the current project directory in the terminal and use the command "obook dev" to preview in real time.

## How to package

In the same pattern, use the command `obook build` to package the project into the `dist` directory defined in `package.json`.

Next, you can directly go to the [base-files](../base-files.md) section to view more information.


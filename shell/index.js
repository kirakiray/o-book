#!/usr/bin/env node

import { readFileSync } from "fs";
import init from "./init.js";
import update from "./update.js";
import dev from "./devAndBuild.js";

let packagejson = readFileSync(`${process.env.PWD}/package.json`);

let obook = null;
if (packagejson) {
  packagejson = JSON.parse(packagejson);
  obook = packagejson.obook;
}

const { argv } = process;

if (argv.includes("update")) {
  // update
  update({ obook });
} else if (argv.includes("init")) {
  // init
  init({ obook });
} else if (argv.includes("dev") || argv.includes("build")) {
  dev({ obook });
} else {
  console.log(`
Please select the command you want to execute:

dev: Enter development mode, you can preview the obook packaged file in real time.
build: Package the project, make sure the obook property is set in the package.json file.
update: Upgrade all obook in the project to the latest version.
`);
}

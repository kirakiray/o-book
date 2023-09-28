#!/usr/bin/env node

import { readFileSync } from "fs";
import init from "./init.js";
import update from "./update.js";
import dev from "./devAndBuild.js";
import trans from "./translate/main.js";

let packagejson = readFileSync(`${process.env.PWD}/package.json`);

let obook = null,
  transConfigs = null;
if (packagejson) {
  packagejson = JSON.parse(packagejson);
  obook = packagejson.obook;
  transConfigs = packagejson["obook-translate"];
}

const { argv } = process;

if (argv.includes("update")) {
  // update
  // setTimeout(() => {
  update({ obook });
  // }, 2000);
} else if (argv.includes("init")) {
  // init
  init({ obook });
} else if (argv.includes("dev") || argv.includes("build")) {
  dev({ obook });
} else if (argv.includes("trans")) {
  // setTimeout(() => {
  trans(transConfigs);
  // }, 2000);
} else if (
  argv.includes("version") ||
  argv.includes("-v") ||
  argv.includes("--version")
) {
  // 打包时，这个字符串会被替换版本号
  console.log("obook@2.1.16".replace("obook@", ""));
} else {
  console.log(`
Please select the command you want to execute:

dev: Enter development mode, you can preview the obook packaged file in real time.
build: Package the project, make sure the obook property is set in the package.json file.
update: Upgrade all obook in the project to the latest version.
trans: translate your markdown documents.
-v: show obook version
`);
}

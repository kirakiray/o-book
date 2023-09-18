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

if (process.argv.includes("update")) {
  // update
  update({ obook });
} else if (process.argv.includes("init")) {
  // init
  init({ obook });
} else {
  dev({ obook });
}

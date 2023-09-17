#!/usr/bin/env node

import { readFileSync } from "fs";
import Koa from "koa";
import st from "koa-static";
import open from "open";
import path from "path";
import AdmZip from "adm-zip";
import { rimraf } from "rimraf";
import { openPage } from "./openPage.mjs";
import init from "./init";
import update from "./update";

// 无头浏览器实例
let client;

let packagejson = readFileSync(`${process.env.PWD}/package.json`);

let obook = null;
if (packagejson) {
  packagejson = JSON.parse(packagejson);
  obook = packagejson.obook;
}

const targetHtml = path.resolve(process.env.PWD, obook.input);

const dir = path.dirname(targetHtml);

if (process.argv.includes("update")) {
  // update
  update();
  return;
}
if (process.argv.includes("init")) {
  // init
  init();
  return;
}

const app = new Koa();

app.use(st(dir));

const outputFile = async (buffer) => {
  // 解压缩打包的文件
  const zip = new AdmZip(buffer);

  const targetPath = path.resolve(process.env.PWD, obook.output);

  const entries = zip.getEntries();

  const needRemoves = entries.filter((e) => {
    const arr = e.entryName.split("/");
    if ((arr.length === 2) & (arr[1] === "")) {
      return true;
    }

    return false;
  });

  await Promise.all(
    needRemoves.map(async (entry) => {
      const p = path.resolve(targetPath, entry.entryName);

      await rimraf(p);
    })
  );

  await zip.extractAllTo(targetPath, true);

  client.close();

  if (!process.argv.includes("dev")) {
    server.close();
  }

  console.log(`dist to: ${targetPath}`);
};

app.use(async (ctx, next) => {
  if (ctx.method === "POST" && ctx.path === "/postzip") {
    await new Promise((res) => {
      let data = [];
      let size = 0;
      ctx.req.on("data", (chunk) => {
        data.push(chunk);
        size += chunk.length;
      });

      ctx.req.on("end", async () => {
        let buffer = Buffer.concat(data, size);

        await outputFile(buffer);

        res();
      });
    });

    ctx.body = JSON.stringify({
      stat: "ok",
    });
  }

  await next();
});

const port = obook.port || 48956;

const server = app.listen(port);

const inputName = obook.input.split("/").slice(-1)[0];

if (process.argv.includes("build")) {
  console.log("The project is being packaged");

  client = await openPage(`http://localhost:${port}/${inputName}#upload-zip`);
}

if (process.argv.includes("dev")) {
  console.log(`preview: http://localhost:${port}/${inputName}`);

  setTimeout(() => {
    open(`http://localhost:${port}/${inputName}`);
  }, 100);
}

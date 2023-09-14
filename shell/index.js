import { readFileSync } from "fs";
import Koa from "koa";
import st from "koa-static";
import open from "open";
import path from "path";
import AdmZip from "adm-zip";
import { rimraf } from "rimraf";
import { openPage } from "./openPage.mjs";

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

const app = new Koa();

app.use(st(dir));

const outputFile = async (buffer) => {
  // 解压缩打包的文件
  const zip = new AdmZip(buffer);

  const targetPath = path.resolve(process.env.PWD, obook.output);

  await rimraf(targetPath);

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

const server = app.listen(48956);

if (process.argv.includes("build")) {
  client = await openPage("http://localhost:48956/#upload-zip");
}

if (process.argv.includes("dev")) {
  setTimeout(() => {
    open(`http://localhost:48956/`);
  }, 100);
}

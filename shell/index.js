import { readFileSync } from "fs";
import Koa from "koa";
import st from "koa-static";
import open from "open";
import path from "path";
import AdmZip from "adm-zip";
import { rimraf } from "rimraf";

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
  const zip = new AdmZip(buffer);

  const targetPath = path.resolve(process.env.PWD, obook.output);

  await rimraf(targetPath);

  zip.extractAllTo(targetPath, true);
};

app.use(async (ctx, next) => {
  if (ctx.method === "POST" && ctx.path === "/asd") {
    console.log(ctx.request.body);

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

app.listen(48956);

if (process.argv.includes("dev")) {
  setTimeout(() => {
    open(`http://localhost:48956/`);
  }, 100);
}

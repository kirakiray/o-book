// import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.mjs";
import "https://cdn.jsdelivr.net/npm/jszip";
const load = lm(import.meta);

export const exportProject = async ({ server }) => {
  const { flatFiles } = await load("@nos/core/util.js");
  const handle = server._handle;

  const zip = new JSZip();

  const vrootPath = server.path;

  // 添加html页面
  for (let item of server.allDatas) {
    for (let e of item.articles) {
      const path = `${item.lang}/${e.path}`;
      const url = `${vrootPath}/${path}`;

      await zip.file(path, await fetch(url).then((e) => e.blob()));
    }

    // 添加 config.json 和 _articles.json
    const configFile = await fetch(
      `${vrootPath}/${item.lang}/config.json`
    ).then((e) => e.blob());
    await zip.file(`${item.lang}/config.json`, configFile);
    const articlesFile = await fetch(
      `${vrootPath}/${item.lang}/_articles.json`
    ).then((e) => e.blob());
    await zip.file(`${item.lang}/_articles.json`, articlesFile);
  }

  // 添加_publics目录
  const publicsHandle = await handle.get("_publics").catch(() => null);
  if (publicsHandle) {
    await Promise.all(
      (
        await flatFiles(publicsHandle)
      ).map(async (e) => {
        const path = e.handle.path.split("/").slice(1).join("/");
        const file = await e.handle.file();

        await zip.file(path, file);
      })
    );
  }

  // 添加_statics目录
  const staticsZipFile = await fetch("/_statics.zip").then((e) => e.blob());
  const statisDir = await JSZip.loadAsync(staticsZipFile);

  for (let item of Object.values(statisDir.files)) {
    if (item.dir) {
      continue;
    }

    const file = await item.async("blob");

    await zip.file(`_statics/${item.name}`, file);
  }

  // 添加测试用nodejs脚本代码
  await zip.file(
    `package.json`,
    JSON.stringify({
      name: server._handle.name,
      type: "module",
      scripts: {
        static: "node nodejs-scripts/static-server.js",
      },
      devDependencies: {
        koa: "^2.14.1",
        "koa-static": "^5.0.0",
        open: "^10.0.2",
      },
    })
  );

  let staticServerText = await fetch("/scripts/static-server.js")
    .then((e) => e.text())
    .then((text) => {
      const port = 20000 + Math.floor(Math.random() * 10000);
      return `import open, { apps } from "open";${text.replace(/5515/g, port)};
      await open("http://127.0.0.1:${port}", { app: { name: apps.chrome } });`;
    });

  await zip.file(`nodejs-scripts/static-server.js`, staticServerText);

  const content = await zip.generateAsync({ type: "blob" });

  const a = document.createElement("a");
  a.setAttribute(
    "download",
    `obook-${
      server._handle.name ||
      new Date().toLocaleString().replace(/[\/ :\.]/g, "-")
    }.zip`
  );
  const furl = URL.createObjectURL(content);
  a.setAttribute("href", furl);
  a.click();

  setTimeout(() => URL.revokeObjectURL(furl), 3000);
};

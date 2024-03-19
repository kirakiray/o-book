// import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.mjs";
import "https://cdn.jsdelivr.net/npm/jszip";

export const exportProject = async ({ handle, server }) => {
  //   const configText = await handle.get("config.yaml").then((e) => e.text());

  //   const configData = yaml.load(configText);

  const zip = new JSZip();

  const vrootPath = server.path;

  for (let item of server.allDatas) {
    for (let e of item.articles) {
      const path = `${item.lang}/${e.path}`;
      const url = `${vrootPath}/${path}`;

      await zip.file(path, await fetch(url).then((e) => e.blob()));
    }
  }

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

import { getRelativeURL } from "./util.js";

export const statics = async ({ path }) => {
  if (/^_statics\//.test(path)) {
    const repath = path.replace(/^_statics\//, "statics/");

    const headers = {};

    const body = await fetch(repath).then((resp) => {
      for (let [name, value] of resp.headers) {
        headers[name] = value;
      }

      return resp.text();
    });

    return {
      body,
      headers,
    };
  }
};

export const config = async ({ path, all }) => {
  if (/^[a-z]+\/config.json/.test(path)) {
    return {
      body: JSON.stringify(all),
    };
  }
};

export const respPage = async ({ path, handle, temp }) => {
  const paths = path.split("/");
  let path1, path2;
  if (paths.length) {
    const last = paths.slice(-1)[0];
    path1 = [...paths.slice(0, -1), last.replace(/\.md$/, ".html")].join("/");
    path2 = [...paths.slice(0, -1), last.replace(/\.html$/, ".md")].join("/");
  }

  let fileHandle = null;
  try {
    fileHandle = await handle.get(path1).catch(() => handle.get(path2));
  } catch (err) {
    console.error("open file error: ", err);
    return null;
  }

  // 替换资源地址和模板内容
  let content = temp.replace("{[content]}", await fileHandle.text());
  content = content.replace(
    '<link rel="stylesheet" href="./styles/index.css" />',
    `<link rel="stylesheet" href="${getRelativeURL(
      path,
      "_statics/styles/index.css"
    )}" />`
  );
  content = content.replace(
    "const configUrl = null;",
    `const configUrl = "${getRelativeURL(path, "/config.json").replace(
      "../",
      ""
    )}";`
  );
  content = content.replace(
    ' <o-app src="./app-config.js">',
    ` <o-app src="${getRelativeURL(path, "_statics/app-config.js")}">`
  );
  content = content.replace(
    'export const parent = "./pages/layout.html";',
    `export const parent = "${getRelativeURL(
      path,
      "_statics/pages/layout.html"
    )}";`
  );

  return {
    body: content,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  };
};

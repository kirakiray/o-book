import { getRelativeURL } from "./util.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

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
    const lang = path.split("/")[0];
    const target = all.find((e) => e.lang === lang);
    return {
      body: JSON.stringify(target.data),
    };
  }
};

export const articleTask = async ({ path, all }) => {
  if (/^[a-z]+\/_articles.json/.test(path)) {
    const lang = path.split("/")[0];
    const target = all.find((e) => e.lang === lang);

    return {
      body: JSON.stringify(target.articles),
    };
  }
};

// 修正并返回普通页面的内容
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
    console.warn("open file error: ", err, path);
    return null;
  }

  // 替换资源地址和模板内容
  let content = await fileHandle.text();

  if (/\.md/.test(fileHandle.name)) {
    content = marked.parse(content);
  }

  // 替换link的链接
  // md 后缀改为html 后缀
  // 链接本机的页面，都带上 olink 属性
  {
    const articleTempEl = $(`<template>${content}</template>`);
    articleTempEl.all("a").forEach((el) => {
      let href = el.attr("href");
      if (!/^http[s]?:/.test(href)) {
        href = href.replace(/\.md/, ".html");
        el.attr("olink", "");
      }
      el.attr("href", href);
    });
    content = articleTempEl.html;
  }

  content = temp.replace("{[content]}", content);
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
  //

  content = content.replace(
    "const DOCROOT = null;",
    `const DOCROOT = "${getRelativeURL(path, "/").replace("../", "") || "./"}";`
  );

  content = content.replace(
    '<o-app src="./app-config.js">',
    `<o-app src="${getRelativeURL(path, "_statics/app-config.js")}">`
  );
  content = content.replace(
    '<l-m src="./comps/article-toc.html"></l-m>',
    `<l-m src="${getRelativeURL(
      path,
      "_statics/comps/article-toc.html"
    )}"></l-m>`
  );
  content = content.replace(
    "const selfPath = null;",
    `const selfPath = "${paths.slice(1).join("/")}";`
  );
  content = content.replace(
    `href="./styles/github-markdown.css"`,
    `href="${getRelativeURL(path, "_statics/styles/github-markdown.css")}"`
  );

  content = content.replace(
    `await load("../_statics/data.js")`,
    `await load("${getRelativeURL(path, "_statics/data.js")}");`
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

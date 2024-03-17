import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.mjs";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

// 获取所有文章和相关信息
export const getAllArticles = async (handle) => {
  const flats = [];

  for await (let [name, subHandle] of handle.entries()) {
    const path = subHandle.paths.slice(2).join("/");

    if (subHandle.kind === "file") {
      if (/\.html$/.test(name) || /\.md$/.test(name)) {
        const repath = path.replace(/\.md/, ".html");

        // 将文章内容转成纯文本内容，给后面全文搜索用
        let content = await subHandle.text();
        if (/\.md/.test(path)) {
          content = marked.parse(content);
        }
        let tempEl = $(`<template>${content}</template>`);
        tempEl = $(tempEl.ele.content);
        content = tempEl.map((e) => {
          return {
            t: e.tag,
            c: e.text.trim(),
          };
        });
        // content = tempEl.ele.content.textContent;

        flats.push({
          path: repath,
          title: tempEl.$("h1,h2,h3,h4,h5")?.text,
          content,
        });
      }
    } else if (subHandle.kind === "directory") {
      const subData = await getAllArticles(subHandle);
      flats.push(...subData);
    }
  }

  return flats;
};

export const getSummarys = async (handle) => {
  const summarys = [];
  for await (let [name, subHandle] of handle.entries()) {
    if (subHandle.kind === "directory") {
      const summaryHandle = await subHandle
        .get("summary.yaml")
        .catch(() => null);

      if (summaryHandle) {
        const summary = yaml.load(await summaryHandle.text());
        summary.dirName = name;
        const fixSuffix = (item) => {
          if (item.list) {
            item.list.forEach((e) => fixSuffix(e));
            return;
          }

          item.ftype = item.path.replace(/.+\.(.+)/, "$1");
          item.path = item.path.replace(/\.md/, ".html");
        };
        fixSuffix(summary);
        summarys.push(summary);
      }
    }
  }
  return summarys;
};

export function getRelativeURL(base, target) {
  var a = document.createElement("a");
  a.href = base;
  var basePaths = a.pathname.split("/").slice(1);
  a.href = target;
  var targetPaths = a.pathname.split("/").slice(1);
  var commonLength = 0;
  while (
    commonLength < basePaths.length &&
    basePaths[commonLength] === targetPaths[commonLength]
  ) {
    commonLength++;
  }
  var baseRemains = basePaths.slice(commonLength + 1);
  var targetRemains = targetPaths.slice(commonLength);
  var relativePathParts = [];
  for (var i = 0; i < baseRemains.length; i++) {
    relativePathParts.push("..");
  }
  relativePathParts = relativePathParts.concat(targetRemains);
  return relativePathParts.join("/");
}

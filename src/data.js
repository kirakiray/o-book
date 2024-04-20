import { create } from "./mdserver.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export const currentData = {
  handle: null,
  server: null,
};

export const getLangOptions = () => {
  return currentData.server.allDatas.map((e) => {
    let name = "";
    const { lang } = e;

    switch (lang) {
      case "cn":
        name = "简体中文";
        break;
      case "t-cn":
        name = "繁体中文";
        break;
      case "en":
        name = "English";
        break;
    }

    return {
      lang,
      name,
    };
  });
};

export const configDataByLang = async (lang) => {
  return currentData.server.allDatas.find((e) => e.lang === lang);
};

export const getSummary = async ({ lang }) => {
  if (!currentData.server) {
    return null;
  }

  const entryLink = currentData.server.path + "/";

  const target = await configDataByLang(lang);

  const summarys = fixSummary(target.data.summarys, {
    entryLink: entryLink,
    lang,
  });

  return summarys;
};

const fixSummary = (list, opts) => {
  return list.map((item) => {
    if (item.list) {
      return {
        ...item,
        list: fixSummary(item.list, {
          rootDir: opts.rootDir || item.dirName,
          ...opts,
        }),
      };
    }

    return {
      ...item,
      url: `${opts.entryLink}${opts.lang}/${opts.rootDir}/${item.path}`,
    };
  });
};

export const initServer = async ({ handle }) => {
  currentData.handle = handle;
  currentData.server = await create({
    handle,
    temp: await fetch("/statics/index.html").then((e) => e.text()),
  });
};

// 获取文件列表，包含 yaml 文件
export const getFileList = async (lang) => {
  // const allData = await getAllFileData(currentData.handle);

  const prefixUrl = currentData.server.path;
  const rootName = currentData.handle.name;

  const allData = await getAllFileData(
    await currentData.handle.get(lang),
    async (item) => {
      const isMd = /\.md/.test(item._handle.name);
      const isHtml = /\.html/.test(item._handle.name);
      if (isMd || isHtml) {
        // 添加访问链接
        item.url = item._handle.path
          .replace(rootName, prefixUrl)
          .replace(/\.md$/, ".html");

        let innerHTML = await item._handle.text();

        if (isMd) {
          // 转换markdown为html
          innerHTML = marked.parse(innerHTML);
        }

        // 获取标题
        const tempEl = $(`<template>${innerHTML}</template>`);

        // 查找第一个标题元素并获取内容
        const firstTitleEl = tempEl.$("h1,h2,h3,h4,h5");
        if (firstTitleEl) {
          item.title = firstTitleEl.text;
        }
      }
    }
  );

  return allData;
};

// 获取文件夹内的所有文件数据，方便一口气处理数据
const getAllFileData = async (dirHandle, callback) => {
  const dir = {
    name: dirHandle.name,
    kind: "directory",
    // path: dirHandle.path,
    list: [],
  };

  for await (let item of dirHandle.values()) {
    if (/^_/.test(item.name)) {
      continue;
    }

    if (item.kind === "directory") {
      const childDir = await getAllFileData(item, callback);
      dir.list.push(childDir);
    } else if (
      /\.html$/.test(item.name) ||
      /\.md$/.test(item.name) ||
      /\.yaml$/.test(item.name)
    ) {
      const fileData = {
        name: item.name,
        // kind: item.kind,
        path: item.path,
        // data: await item.text(),
        _handle: item,
      };
      if (callback) {
        await callback(fileData);
      }
      dir.list.push(fileData);
    }
  }

  return dir;
};

import { create } from "./mdserver.js";

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

export const getSummary = ({ lang, entryLink }) => {
  const { allDatas } = currentData.server;

  const langOptions = getLangOptions();

  const target = allDatas.find((e) => e.lang === lang);

  const summarys = fixSummary(target.data.summarys, {
    entryLink: entryLink,
    lang,
  });

  return {
    langOptions,
    target,
    summarys,
  };
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

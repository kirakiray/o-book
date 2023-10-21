// 文档时的左侧导航数据
export const leftNavsData = $.stanz([]);

export const isDark = $.stanz({
  value: localStorage.isDark === "true",
});

isDark.watch(() => {
  localStorage.isDark = isDark.value;
});

export const getLang = async () => {
  if (!window.configUrl) {
    return;
  }

  const cdata = await configData;

  const currentConfigUrl = new URL(configUrl, location.href).href;

  let selectedLang = "";

  cdata.urls.forEach(({ lang, src }) => {
    currentConfigUrl;

    if (currentConfigUrl.includes(src.replace(/^\.\//, ""))) {
      selectedLang = lang;
    }
  });

  switch (selectedLang) {
    case "cn":
    case "t-cn":
    case "en":
    case "es":
      break;
    default:
      selectedLang = "";
  }

  return selectedLang;
};

export const configData = new Promise(async (resolve) => {
  if (!window.configUrl) {
    resolve();
    return;
  }

  const configPath = new URL(configUrl, location.href).href;
  let cdata = await fetch(configPath).then((e) => e.json());

  cdata.navs.forEach((e) => {
    const summaryPath = new URL(e.summary, configPath).href;

    const items = e.articles.flatMap((item) => {
      if (item.childs) {
        item.childs.forEach((item) => {
          item.fixedHref = new URL(item.href, summaryPath).href.replace(
            /md$/,
            "html"
          );
        });
        return item.childs;
      }

      item.fixedHref = new URL(item.href, summaryPath).href.replace(
        /md$/,
        "html"
      );

      return [item];
    });

    e.href = items[0].fixedHref.replace(/\.md$/, ".html");
  });

  resolve(cdata);
});

// 用于监听窗口大小
export const size = $.stanz({
  width: 0,
  height: 0,
});

let timer;
window.addEventListener("resize", () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
  }, 100);
});

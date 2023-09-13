// 文档时的左侧导航数据
export const leftNavsData = $.stanz([]);

export const isDark = $.stanz({
  value: localStorage.isDark === "true",
});

isDark.watch(() => {
  localStorage.isDark = isDark.value;
});

let lang = location.pathname.replace(/\/(.+?)\/.+/, "$1");

switch (lang) {
  case "cn":
  case "t-cn":
  case "en":
  case "es":
    break;
  default:
    lang = "";
}

export { lang };

export const configData = new Promise(async (resolve) => {
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

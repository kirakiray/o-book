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

// 修正 configData 的数据
let cdata = localStorage.__configData;

if (cdata) {
  cdata = JSON.parse(cdata);
}

const realRoot = location.href.split("/$/")[0] + "/$/";

cdata.navs.forEach((e) => {
  const summaryPath = new URL(e.summary, realRoot).href;

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

export const configData = $.stanz(cdata ? cdata : {});

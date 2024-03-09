export const showLeft = $.stanz({
  value: true,
});

export const navs = $.stanz([
  {
    name: "案例教程",
  },
  {
    name: "文档",
  },
  {
    name: "API",
  },
]);

export const articlesList = $.stanz([
  {
    name: "test1",
    link: "",
  },
  {
    name: "test2",
    childs: [
      {
        name: "test 2 sub 1",
      },
      {
        name: "test 2 sub 2",
      },
    ],
  },
]);

if (typeof configUrl === "string") {
  // 加载数据
  (async () => {
    const { articleData, configData } = await fetch(configUrl).then((e) => {
      return e.json();
    });

    navs.splice(0, 1000, ...configData.navs);

    console.log(articleData, configData);
  })();
}

export const resetData = (path) => {
  console.log("resetData", path);
};

window.showLeft = showLeft;

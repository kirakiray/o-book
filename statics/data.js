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
    const data = await fetch(configUrl).then((e) => {
      return e.text();
    });

    console.log(new URL(configUrl, location.href + "/").pathname, data);
  })();
}

window.showLeft = showLeft;

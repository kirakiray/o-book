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
    name: "介绍",
    link: "",
  },
  {
    name: "使用 ofa.js",
    childs: [
      {
        name: "aaaaa",
      },
      {
        name: "aaaaa2",
      },
    ],
  },
]);

window.showLeft = showLeft;

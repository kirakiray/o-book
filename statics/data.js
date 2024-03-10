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

const gloData = {};

if (typeof configUrl === "string") {
  // 加载数据
  (async () => {
    const { articleData, configData } = await fetch(configUrl).then((e) => {
      return e.json();
    });

    // 初始化顶部
    navs.splice(0, 1000, ...configData.navs);

    Object.assign(gloData, { articleData, configData });

    console.log(articleData, configData);
  })();
}

export const initPath = (path) => {
  const {
    configData: { navs },
    articleData: { childs: dirs },
  } = gloData;

  console.log("initPath", path);

  // 修正左侧导航的内容
  // 先判断在哪个导航上，修正为那个导航上的内容
  const targetNav = navs.find((e) => {
    const reg = new RegExp("^" + e.src + "/");
    if (reg.test(path)) {
      return true;
    }
  });

  if (targetNav) {
    // 存在导航地址内，修正顶部导航的激活
    showLeft.value = true;

    const firstDirName = targetNav.src.split("/")[0];

    const targetDir = dirs.find((e) => e.name === firstDirName);

    if (targetDir) {
      articlesList.splice(0, 1000, ...targetDir.childs);
    }
  } else {
    // 不在导航内，隐藏左侧菜单
    showLeft.value = false;
  }
};

window.showLeft = showLeft;

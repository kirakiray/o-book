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

let _oldNavDir = null;

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

    if (_oldNavDir !== targetDir) {
      if (targetDir) {
        articlesList.splice(0, 1000, ...fixLeftNavItem(targetDir).childs);
      }
    }
    fixLeftNavActive(articlesList, path);

    _oldNavDir = targetDir;
  } else {
    // 不在导航内，隐藏左侧菜单
    showLeft.value = false;
  }
};

const fixLeftNavActive = (list, activePath) => {
  let hasActive = false;
  list.forEach((e) => {
    if (e.path) {
      if (e.path === activePath) {
        e.active = 1;
        hasActive = true;
      } else {
        e.active = null;
      }
    } else {
      const result = fixLeftNavActive(e.childs, activePath);
      if (result) {
        hasActive = true;
        e.parentActive = 1;
      } else {
        e.parentActive = null;
      }
    }
  });

  return hasActive;
};

// 修复左侧导航栏的地址
const fixLeftNavItem = (item) => {
  if (item.childs) {
    return {
      name: item.name,
      childs: item.childs.map((e) => fixLeftNavItem(e)),
    };
  }

  return {
    path: item.path,
    name: item.name,
    href: new URL(item.path, langRoot).href,
  };
};

window.showLeft = showLeft;

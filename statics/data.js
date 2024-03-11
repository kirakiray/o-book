export const showLeft = $.stanz({
  value: true,
});

export const navs = $.stanz([
  {
    name: "nav1",
  },
  {
    name: "nav2",
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

export const configs = $.stanz({
  logo: {
    text: "obook",
    pic: "https://obook.ofajs.com/publics/logo.svg",
  },
});

let summarysData = null;

if (typeof configUrl === "string") {
  // 加载数据
  (async () => {
    const { configData, summarys } = await fetch(configUrl).then((e) =>
      e.json()
    );

    Object.assign(configs, configData);

    // 给所有地址前添加dirName，转为相对地址
    const fixSummarysPath = (list, dirName) => {
      list.forEach((e) => {
        if (e.list) {
          fixSummarysPath(e.list, dirName);
        } else if (e.path) {
          e.path = `${dirName}/${e.path}`;
        }
      });
    };

    summarys.forEach((e) => {
      fixSummarysPath(e.list, e.dirName);
    });

    summarysData = summarys;

    // 初始化顶部
    navs.splice(
      0,
      1000,
      ...summarysData.map((e) => {
        const indexItem = e.list.find((item) => /index\.html/.test(item.path));

        return {
          name: e.name,
          src: e.dirName,
          href: new URL(indexItem.path, langRoot).href,
        };
      })
    );
  })();
}

let _oldSummary = null;
export const initPath = (path) => {
  // 先判断在哪个导航上，修正为那个导航上的内容
  const targetNav = navs.find((e) => {
    const reg = new RegExp("^" + e.src + "/");
    if (reg.test(path)) {
      return true;
    }
  });

  if (targetNav) {
    showLeft.value = true;

    const targetSummary = summarysData.find((e) => e.dirName === targetNav.src);

    if (targetSummary !== _oldSummary) {
      articlesList.splice(0, 1000, ...fixLeftNavItem(targetSummary).childs);
    }

    fixLeftNavActive(articlesList, path);

    _oldSummary = targetSummary;
  } else {
    // 不在导航内，隐藏左侧菜单
    showLeft.value = false;
  }

  fixTopNavActive(path);
};

// 修复左侧导航栏的访问地址
const fixLeftNavItem = (item) => {
  if (item.list) {
    return {
      name: item.name,
      childs: item.list.map((e) => fixLeftNavItem(e)),
    };
  }

  return {
    path: item.path,
    name: item.name,
    href: new URL(item.path, langRoot).href,
  };
};

// 修正左侧导航的激活状态数据
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

// 修正顶部导航的激活状态
const fixTopNavActive = (path) => {
  const firstMatch = path.split("/")[0];

  navs.forEach((e) => {
    if (e.src === firstMatch) {
      e.active = 1;
    } else {
      e.active = null;
    }
  });
};

window.showLeft = showLeft;

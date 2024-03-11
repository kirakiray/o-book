import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.mjs";

// 获取所有文章和相关信息
export const getAllArticles = async (handle) => {
  const flats = [];
  const childs = [];

  for await (let [name, subHandle] of handle.entries()) {
    const path = subHandle.paths.slice(2).join("/");

    if (subHandle.kind === "file") {
      if (/\.html$/.test(name) || /\.md$/.test(name)) {
        const repath = path.replace(/\.md/, ".html");

        flats.push({
          path: repath,
        });

        childs.push({
          name,
          type: subHandle.kind,
          path: repath,
        });
      }
    } else if (subHandle.kind === "directory") {
      const subData = await getAllArticles(subHandle);
      flats.push(...subData.flats);
      childs.push({
        name,
        type: subHandle.kind,
        childs: subData.childs,
      });
    }
  }

  return { flats, childs };
};

export const getSummarys = async (handle) => {
  const summarys = [];
  for await (let [name, subHandle] of handle.entries()) {
    if (subHandle.kind === "directory") {
      const summaryHandle = await subHandle
        .get("summary.yaml")
        .catch(() => null);

      if (summaryHandle) {
        const summary = yaml.load(await summaryHandle.text());
        summary.dirName = name;
        const fixSuffix = (item) => {
          if (item.list) {
            item.list.forEach((e) => fixSuffix(e));
            return;
          }

          item.path = item.path.replace(/\.md/, ".html");
        };
        fixSuffix(summary);
        summarys.push(summary);
      }
    }
  }
  return summarys;
};

export function getRelativeURL(base, target) {
  var a = document.createElement("a");
  a.href = base;
  var basePaths = a.pathname.split("/").slice(1);
  a.href = target;
  var targetPaths = a.pathname.split("/").slice(1);
  var commonLength = 0;
  while (
    commonLength < basePaths.length &&
    basePaths[commonLength] === targetPaths[commonLength]
  ) {
    commonLength++;
  }
  var baseRemains = basePaths.slice(commonLength + 1);
  var targetRemains = targetPaths.slice(commonLength);
  var relativePathParts = [];
  for (var i = 0; i < baseRemains.length; i++) {
    relativePathParts.push("..");
  }
  relativePathParts = relativePathParts.concat(targetRemains);
  return relativePathParts.join("/");
}

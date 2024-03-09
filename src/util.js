// 获取所有文章和相关信息
export const getAllArticles = async (handle) => {
  const flats = [];
  const childs = [];

  for await (let [name, subHandle] of handle.entries()) {
    const path = subHandle.paths.slice(2).join("/");

    if (subHandle.kind === "file") {
      if (/\.html$/.test(name) || /\.md$/.test(name)) {
        flats.push({
          path,
        });

        childs.push({
          name,
          type: subHandle.kind,
          path,
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

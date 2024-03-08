export const getAllArticles = async (handle) => {
  const flats = [];
  const childs = [];

  for await (let [name, subHandle] of handle.entries()) {
    const path = subHandle.paths.slice(1).join("/");
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

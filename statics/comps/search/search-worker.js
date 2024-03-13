let articleResove;
let fetched = false; // 是否已经发送请求
const articlesPms = new Promise((res) => (articleResove = res));

onmessage = async (e) => {
  const {
    data: { content, taskId, articlesUrl },
    target,
  } = e;

  if (!fetched) {
    fetched = true;
    const artContent = await fetch(articlesUrl).then((e) => e.json());
    articleResove(artContent);
  }

  const articles = await articlesPms;

  // 匹配所有内容
  let results = [];
  articles.forEach((item) => {
    let pageDatas = [];
    let head = null;
    item.content.forEach((part, pId) => {
      if (["h1", "h2", "h3", "h4", "h5"].includes(part.t)) {
        head = part.c;
      }
      const index = part.c.indexOf(content);
      if (index > -1) {
        let startId = index - 10 < 0 ? 0 : index - 10;
        pageDatas.push({
          head,
          pId,
          tag: part.t,
          // index,
          excerpt: `${startId > 0 ? "..." : ""}${part.c.slice(
            startId,
            index
          )}<span class="search-highlight">${content}</span>${part.c.slice(
            index + content.length,
            index + content.length + 20
          )}${index + content.length + 20 > part.c.length ? "" : "..."}`,
        });
      }
    });

    if (pageDatas.length) {
      results.push({
        title: item.title,
        path: item.path,
        datas: pageDatas,
      });
    }
  });

  target.postMessage({
    taskId,
    results,
  });
};

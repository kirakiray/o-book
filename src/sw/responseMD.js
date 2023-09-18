const responseMD = async (url, configUrl = "") => {
  const realUrl = url.replace("/@/", "/").replace(/html$/, "md");

  let targetTemp = await wrapFetch(realUrl)
    .then((e) => {
      if (/^2/.test(e.status)) {
        return e.text();
      } else {
        return null;
      }
    })
    .catch(() => null);

  if (!targetTemp) {
    return new Response("", {
      status: 404,
    });
  }

  let tempText = await wrapFetch(`${host}/src/temps/article.html`, "text");

  const selfOri = new URL(self.serviceWorker.scriptURL).origin;

  const fixTokens = (item) => {
    if (item.type === "link") {
      const { href } = item;

      const afterLink = new URL(href, url).href;

      if (afterLink.includes(selfOri)) {
        const path = afterLink.split("/@/")[1];

        if (!/^publics\//.test(path) && /\.md$/.test(href)) {
          item.href = item.href.replace(/\.md$/, ".html");
        }
      }
    }

    if (item.tokens) {
      item.tokens.forEach((e) => fixTokens(e));
    } else if (item.items) {
      item.items.forEach((e) => fixTokens(e));
    }
  };

  const tokens = marked.lexer(targetTemp);

  tokens.forEach((e) => {
    fixTokens(e);
  });

  let article = `<article class="markdown-body">${marked.parser(tokens)}
  <article-footer></article-footer>
  </article>`;

  // 看是否包裹类型
  if (tokens[0].type === "html") {
    const wrapCompName = tokens[0].text.replace(/.+ type\:(.+) [\s\S]+/, "$1");

    const matchArr = wrapCompName.match(/<template is="(.+?)">/);

    if (matchArr) {
      const wrapComp = matchArr[1];

      article = `<${wrapComp}>${article}</${wrapComp}>`;
    }
  }

  const firstHeading = tokens.find((e) => e.type === "heading");

  const injectHead = (await storage.getItem("inject-head")) || "";

  const data = {
    host,
    title: firstHeading.text,
    url,
    article,
    configUrl,
    injectHead,
  };

  // 替换模板内容
  Object.keys(data).forEach((name) => {
    const reg = new RegExp(`\<%${name}%\>`, "g");
    tempText = tempText.replace(reg, data[name]);
  });

  return new Response(tempText, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};

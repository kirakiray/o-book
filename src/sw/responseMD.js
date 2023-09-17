const responseMD = async (url, configUrl = "") => {
  const realUrl = url.replace("/@/", "/").replace(/html$/, "md");

  let targetTemp = await fetch(realUrl)
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

  let tempText = await fetch(`${host}/src/temps/article.html`).then((e) => {
    return e.text();
  });

  const selfOri = new URL(self.serviceWorker.scriptURL).origin;

  // 修正link
  targetTemp = targetTemp.replace(/\[.+?\]\(.+?\)/g, (str) => {
    const link = str.replace(/\[.+?\]\((.+?)\)/, "$1");
    const afterLink = new URL(link, url).href;

    if (afterLink.includes(selfOri)) {
      const path = afterLink.split("/@/")[1];

      if (/^publics\//.test(path)) {
        return str;
      }
      const text = str.replace(/\[(.+?)\]\(.+?\)/, "$1");

      if (/\.md$/.test(link)) {
        return `[${text}](${link.replace(/\.md$/, ".html")})`;
      }

      return str;
    }

    return str;
  });

  const lexs = marked.lexer(targetTemp);

  let article = `<article class="markdown-body">${marked.parse(targetTemp)}
  <article-footer></article-footer>
  </article>`;

  // 看是否包裹类型
  if (lexs[0].type === "html") {
    const wrapCompName = lexs[0].text.replace(/.+ type\:(.+) [\s\S]+/, "$1");

    const matchArr = wrapCompName.match(/<template is="(.+?)">/);

    if (matchArr) {
      const wrapComp = matchArr[1];

      article = `<${wrapComp}>${article}</${wrapComp}>`;
    }
  }

  const firstHeading = lexs.find((e) => e.type === "heading");

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

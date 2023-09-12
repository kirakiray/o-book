const host = "http://127.0.0.1:5512";

importScripts("https://cdn.jsdelivr.net/npm/marked/marked.min.js");
importScripts(`${host}/src/storage/index.js`);
importScripts(`${host}/src/sw/getSummary.js`);

const workPath = self.serviceWorker.scriptURL.replace(/(.+)\/.+/, "$1") + "/@/";

const responseMD = async (url) => {
  const realUrl = url.replace("/@/", "/").replace(/html$/, "md");

  const targetTemp = await fetch(realUrl)
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

  let headers = {};
  let tempText = await fetch(`${host}/src/temps/article.html`).then((e) => {
    headers = e.headers;
    return e.text();
  });

  const lexs = marked.lexer(targetTemp);

  let article = `<article class="markdown-body">${marked.parse(
    targetTemp
  )}</article>`;

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

  const data = {
    host,
    title: firstHeading.text,
    url,
    article,
  };

  // 替换模板内容
  Object.keys(data).forEach((name) => {
    const reg = new RegExp(`\<%${name}%\>`, "g");
    tempText = tempText.replace(reg, data[name]);
  });

  return new Response(tempText, {
    status: 200,
    headers,
  });
};

const responseConfig = async (cdata) => {
  const { navs } = cdata;

  await Promise.all(
    navs.map(async (e) => {
      const { summary } = e;

      const summaryUrl = new URL(summary, self.serviceWorker.scriptURL).href;

      const data = await getSummary(summaryUrl);

      e.articles = data;
    })
  );

  return new Response(JSON.stringify(cdata), {
    status: 200,
  });
};

self.addEventListener("fetch", async (event) => {
  const { request } = event;

  if (request.url.includes(workPath)) {
    event.respondWith(
      (async () => {
        let configs = await storage.getItem("config-url");
        configs = configs.map((e) => new URL(e, workPath).href);

        const targetConfig = configs.find((e) => e === request.url);

        let realUrl = request.url.replace(/(.+)#.*/, "$1");
        const darr = realUrl.split("/@/");

        if (targetConfig) {
          // 是config对象
          const data = await fetch(`${darr[0]}/${darr[1]}`).then((e) =>
            e.json()
          );

          return responseConfig(data);
        }

        if (darr.length && /^publics/.test(darr[1])) {
          return fetch(`${darr[0]}/${darr[1]}`);
        }

        if (/\.html$/.test(realUrl)) {
          return responseMD(realUrl);
        }

        return new Response("", {
          status: 404,
        });
      })()
    );
  }
});

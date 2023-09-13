const host = "http://127.0.0.1:5512";

importScripts("https://cdn.jsdelivr.net/npm/marked/marked.min.js");
importScripts(`${host}/src/storage/index.js`);
importScripts(`${host}/src/sw/getSummary.js`);

const workPath = self.serviceWorker.scriptURL.replace(/(.+)\/.+/, "$1") + "/@/";

const responseMD = async (url, configUrl = "") => {
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
    configUrl,
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

const responseConfig = async (cdata, relateUrl) => {
  const { navs } = cdata;

  await Promise.all(
    navs.map(async (e) => {
      const { summary } = e;

      const summaryUrl = new URL(summary, relateUrl).href;

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

        const isConfig = configs.find((e) => e === request.url);

        let realUrl = request.url.replace(/(.+)#.*/, "$1");
        const darr = realUrl.split("/@/");

        if (isConfig) {
          const data = await fetch(`${darr[0]}/${darr[1]}`).then((e) =>
            e.json()
          );

          return responseConfig(data, darr.join("/"));
        }

        if (darr.length && /^publics/.test(darr[1])) {
          return fetch(`${darr[0]}/${darr[1]}`);
        }

        let targetConfig;
        let maxCount = 0;

        // 必须只有一个最大匹配数时，才激活显示的nav
        configs.forEach((e) => {
          const mathsCount = countMatchingChars(realUrl, e);

          if (mathsCount > maxCount) {
            maxCount = mathsCount;
            targetConfig = e;
          }
        });

        if (/\.html$/.test(realUrl)) {
          return responseMD(
            realUrl,
            getRelativePath(realUrl.replace(/(.+)\/.+/, "$1"), targetConfig)
          );
        }

        return new Response("", {
          status: 404,
        });
      })()
    );
  }
});

function getRelativePath(fromPath, toPath) {
  const fromParts = fromPath.split("/");
  const toParts = toPath.split("/");

  while (
    fromParts.length > 0 &&
    toParts.length > 0 &&
    fromParts[0] === toParts[0]
  ) {
    fromParts.shift();
    toParts.shift();
  }

  const relativeParts = fromParts.map(() => "..");

  relativeParts.push(...toParts);

  const relativePath = relativeParts.join("/");

  return relativePath;
}
function countMatchingChars(str1, str2) {
  let count = 0;
  const length = Math.min(str1.length, str2.length);

  for (let i = 0; i < length; i++) {
    if (str1.charAt(i) === str2.charAt(i)) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

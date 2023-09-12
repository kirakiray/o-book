importScripts("https://cdn.jsdelivr.net/npm/marked/marked.min.js");

const host = "http://127.0.0.1:5512";

const workPath = self.serviceWorker.scriptURL.replace(/(.+)\/.+/, "$1") + "/$";

const responseFun = async (url) => {
  const realUrl = url.replace("/$/", "/").replace(/html$/, "md");

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

self.addEventListener("fetch", async (event) => {
  const { request } = event;

  if (request.url.includes(workPath)) {
    let realUrl = request.url.replace(/(.+)#.*/, "$1");
    const darr = realUrl.split("/$/");
    if (darr.length && /^publics/.test(darr[1])) {
      event.respondWith(fetch(`${darr[0]}/${darr[1]}`));
      return;
    }

    event.respondWith(responseFun(realUrl));
  }
});

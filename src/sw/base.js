const host = "http://127.0.0.1:5512";

const workPath = self.serviceWorker.scriptURL.replace(/(.+)\/.+/, "$1") + "/$";

const responseFun = async (request) => {
  const realUrl = request.url.replace("/$/", "/").replace(/html$/, "md");

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

  const data = {
    host,
    url: request.url,
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
    event.respondWith(responseFun(request));
  }
});

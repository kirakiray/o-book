importScripts(`/src/sw/base.js`);
(() => {
  const selfRoot = self.serviceWorker.scriptURL.replace(/(.+)\/.+/, "$1");
  const longUrl = selfRoot + "/__long";
  const resolveUrl = selfRoot + "/__resolve";

  // 只允许有一个标签占用 __long地址
  let inResp = false;
  let timer, resolve;

  // 等待代理应用返回数据
  const waiter = {};
  const waiterResolve = {};

  fetchOptions.agent = async (url, type) => {
    if (resolve && selfRoot.includes(selfRoot)) {
      const targetPath = url.replace(selfRoot + "/", "");

      resolve(
        new Response(
          JSON.stringify({
            type: "get",
            path: targetPath,
          }),
          {
            status: 200,
          }
        )
      );
      resolve = null;
      
      const pms = (waiter[targetPath] = new Promise((res) => {
        waiterResolve[targetPath] = res;
      }));

      // 超时清除
      const errTimer = setTimeout(() => {
        if (waiterResolve[targetPath]) {
          waiterResolve[targetPath]({
            data: "",
            header: {
              status: 408,
            },
          });

          //   // 清除内存
          //   waiter[targetPath] = null;
          //   waiterResolve[targetPath] = null;
        }
      }, 10000);

      const { data, header } = await pms;

      clearTimeout(errTimer);

      // 清除内存
      waiter[targetPath] = null;
      waiterResolve[targetPath] = null;

      if (type === "text") {
        return new TextDecoder("utf-8").decode(data);
      }

      return new Response(data, {
        status: header?.status || 200,
      });
    }

    if (type) {
      return fetch(url).then((e) => e[type]());
    }

    return fetch(url);
  };

  self.addEventListener("fetch", (event) => {
    const { request } = event;
    const urlData = new URL(request.url);
    const url = `${urlData.origin}${urlData.pathname}`;

    if (url === longUrl) {
      if (resolve) {
        debugger;
        return;
      }

      event.respondWith(
        new Promise(async (res) => {
          resolve = res;
          timer = setTimeout(() => {
            resolve = null;
            // 时间到了就返回数据
            res(
              new Response(
                JSON.stringify(
                  {
                    type: "ping",
                  },
                  {
                    status: 200,
                  }
                )
              )
            );
          }, 5000);
        })
      );
    } else if (url === resolveUrl) {
      const targetPath = new URLSearchParams(urlData.search).get("path");

      event.respondWith(
        (async () => {
          const data = await request.arrayBuffer();

          const targetResolve = waiterResolve[targetPath];
          if (targetResolve) {
            targetResolve({
              data,
            });
          }

          return new Response("ok", {
            status: 200,
          });
        })()
      );
    }
  });
})();

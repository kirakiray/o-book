importScripts(`../src/sw/base.js`);
(() => {
  const selfRoot = self.serviceWorker.scriptURL.replace(/(.+)\/.+/, "$1");
  const longUrl = selfRoot + "/__long";

  // 等待代理应用返回数据
  const waiter = {};

  self.addEventListener("message", function (event) {
    const { data: e } = event;

    // console.log("message: ", e);
    if (e.type === "reserver" && e.path) {
      const targetPms = waiter[e.path];

      if (targetPms) {
        targetPms.resolve({ data: e.data });
      }
    }
  });

  let agentReady = false;

  fetchOptions.agent = async (url, type) => {
    if (agentReady && selfRoot.includes(selfRoot)) {
      const targetPath = url.replace(selfRoot + "/", "");

      let pms;
      if (waiter[targetPath]) {
        pms = waiter[targetPath];
      } else {
        let resolve, reject;
        pms = waiter[targetPath] = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        pms.resolve = resolve;
        pms.reject = reject;
      }

      // 超时清除
      let errTimer;
      // const errTimer = setTimeout(() => {
      //   if (waiter[targetPath]) {
      //     resolve({
      //       data: "",
      //       header: {
      //         status: 408,
      //       },
      //     });
      //   }
      // }, 10000);

      self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
          // console.log("client:", client);
          client.postMessage({
            type: "get",
            path: targetPath,
          });
        });
      });

      const { data, header } = await pms;

      clearTimeout(errTimer);

      // 清除内存
      waiter[targetPath] = null;

      if (type === "text") {
        if (!data) {
          return "";
        }
        return new TextDecoder("utf-8").decode(data);
      } else if (type === "json") {
        if (!data) {
          return {};
        }

        const str = new TextDecoder("utf-8").decode(data);
        return JSON.parse(str);
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

    if (request.url === longUrl) {
      const abortController = new AbortController();

      const signal = abortController.signal;
      request.signal = signal;

      let timer;
      signal.addEventListener("abort", function () {
        clearTimeout(timer);
        agentReady = false;
      });

      agentReady = true;
      event.respondWith(
        new Promise(async (res) => {
          timer = setTimeout(() => {
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
            agentReady = false;
          }, 5000);
        })
      );
    }
  });
})();

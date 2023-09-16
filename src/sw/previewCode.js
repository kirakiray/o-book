let tempCaches = {};

self.addEventListener("fetch", (event) => {
  const { request } = event;

  const urldata = new URL(request.url);

  if (urldata.pathname === "/$") {
    tempCaches = {};
    event.respondWith(
      (async () => {
        return new Response(`{"ok":1}`, {
          status: 200,
        });
      })()
    );
  } else if (/^\/\$\//.test(urldata.pathname)) {
    event.respondWith(
      (async () => {
        const realUrl = urldata.pathname.replace(/^\/\$/, "");

        if (request.method === "POST") {
          const body = await request.clone().text();
          tempCaches[realUrl] = body;
          return new Response(`{"ok":1}`, { status: 200 });
        }

        let status, headers;
        let data = await fetch(urldata.origin + realUrl).then((e) => {
          status = e.status;
          headers = e.headers;

          return e.text();
        });

        if (tempCaches[realUrl]) {
          data = tempCaches[realUrl];
          status = 200;
        }

        return new Response(data, {
          status,
          headers,
        });
      })()
    );
  }
});

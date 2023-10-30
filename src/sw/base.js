// let host;
// const hostUrlData = new URL(self.serviceWorker.scriptURL);
// if (hostUrlData.hostname.includes("127")) {
//   host = hostUrlData.origin;
// } else {
//   host = "https://cdn.jsdelivr.net/npm/obook@2.1.38";
// }

// const host = "http://127.0.0.1:5512";

const host = "https://cdn.jsdelivr.net/npm/obook@2.1.38";

importScripts(
  "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
  `${host}/src/storage/index.js`,
  `${host}/src/sw/wrapFetch.js`,
  `${host}/src/sw/getSummary.js`,
  `${host}/src/sw/responseMD.js`,
  `${host}/src/sw/responseLibs.js`
);

const workPath = self.serviceWorker.scriptURL.replace(/(.+)\/.+/, "$1") + "/@/";

const responseConfig = async (cdata, relateUrl) => {
  const { navs, footer } = cdata;

  await Promise.all(
    navs.map(async (e) => {
      const { summary } = e;

      const summaryUrl = new URL(summary, relateUrl).href;

      const data = await getSummary(summaryUrl);

      e.articles = data;
    })
  );

  if (footer) {
    const footerData = await getSummary(new URL(footer, relateUrl).href);

    cdata.footerData = footerData;
  }

  return new Response(JSON.stringify(cdata), {
    status: 200,
  });
};

const responseSitemap = async ({ realUrl }) => {
  const originConfigs = await storage.getItem("config-url");
  const sitemapRoot = await storage.getItem("sitemap-root");

  const urls = [];

  const root = realUrl.replace(/@\/.+$/, "");

  const addUrl = (item, relativeUrl) => {
    if (item.childs) {
      item.childs.forEach((e) => addUrl(e, relativeUrl));
    } else if (item.href) {
      urls.push(new URL(item.href, relativeUrl).href);
    }
  };

  await Promise.all(
    originConfigs.map(async (e) => {
      const jsonurl = new URL(e.src, root).href;

      const data = await wrapFetch(jsonurl, "json");

      const { navs, pages } = data;

      await Promise.all(
        navs.map(async (e) => {
          const summaryUrl = new URL(e.summary, jsonurl).href;

          const sumaryData = await getSummary(summaryUrl);

          sumaryData.forEach((item) => addUrl(item, summaryUrl));
        })
      );

      await Promise.all(
        pages.map(async (e) => {
          const pageUrl = new URL(e, jsonurl).href;

          urls.push(pageUrl);
        })
      );
    })
  );

  let sitemapStr = "";

  urls.forEach((e) => {
    const path = e.replace(root, "").replace(/\.md/, ".html");
    let priority = 0.6;

    if (/index.html$/.test(path)) {
      priority = 1;
    }

    sitemapStr += `
  <url>
    <loc>${new URL(path, sitemapRoot).href}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapStr}\n</urlset>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
    }
  );
};

self.addEventListener("fetch", async (event) => {
  const { request } = event;

  if (request.url.includes(workPath)) {
    event.respondWith(
      (async () => {
        let rurl = request.url;
        if (/\/$/.test(rurl)) {
          rurl = rurl + "index.html";
        }
        const originConfigs = await storage.getItem("config-url");
        const configs = originConfigs.map((e) => {
          return new URL(e.src, workPath).href;
        });

        const isConfig = configs.find((e) => e === rurl);

        let realUrl = rurl.replace(/(.+)\?.*/, "$1");
        realUrl = realUrl.replace(/(.+)#.*/, "$1");
        const darr = realUrl.split("/@/");

        if (isConfig) {
          const data = await wrapFetch(`${darr[0]}/${darr[1]}`, "json");

          data.urls = originConfigs;

          return responseConfig(data, darr.join("/"));
        }

        if (darr.length && /^publics/.test(darr[1])) {
          return wrapFetch(`${darr[0]}/${darr[1]}`);
        }

        let targetConfig;
        let maxCount = 0;

        configs.forEach((e) => {
          const mathsCount = countMatchingChars(realUrl, e);

          if (mathsCount > maxCount) {
            maxCount = mathsCount;
            targetConfig = e;
          }
        });

        if (/@\/sitemap.xml$/.test(realUrl)) {
          return responseSitemap({ realUrl });
        }

        if (/\.html$/.test(realUrl)) {
          return responseMD(
            realUrl,
            getRelativePath(realUrl.replace(/(.+)\/.+/, "$1"), targetConfig)
          );
        }

        if (targetConfig.replace(/(.+)\/.+/, "$1/libs.json") === realUrl) {
          return await responseLibs(targetConfig);
        }

        return new Response("", {
          status: 404,
        });
      })()
    );
  }
});

self.addEventListener("install", () => {
  console.log("install");
  self.skipWaiting();
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

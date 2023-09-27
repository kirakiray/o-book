const responseMD = (() => {
  const returnDocuments = async ({ url, configUrl, tokens, configData }) => {
    let tempText = await fetch(`${host}/src/temps/article.html`).then((e) =>
      e.text()
    );

    const articleText = marked.parser(tokens);

    let article = `<article class="markdown-body">${articleText}
    <article-footer></article-footer>
    </article>`;

    // 看是否包裹类型
    if (tokens[0].type === "html") {
      const wrapCompName = tokens[0].text.replace(
        /.+ type\:(.+) [\s\S]+/,
        "$1"
      );

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
      crawlerCode: getCrawlerCode({ configUrl, url, configData }),
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

  const fixSummaryHref = (e, summaryUrl, pageUrl) => {
    const arr = [];
    if (e.href) {
      const href = new URL(e.href, summaryUrl).href;
      const fixedHref = href.replace(/\.md$/, ".html");
      e.relativePath = getRelativePath(
        pageUrl.replace(/(.+)\/.+/, "$1"),
        fixedHref
      );
      arr.push(e);
    } else if (e.childs) {
      e.childs.forEach((item) => {
        const carr = fixSummaryHref(item, summaryUrl, pageUrl);
        arr.push(...carr);
      });
    }

    return arr;
  };

  const getCrawlerCode = ({ configUrl, url, configData }) => {
    const fixedConfigUrl = new URL(configUrl, url).href;
    const navs = JSON.parse(JSON.stringify(configData.navs));
    const flatLinks = [];
    navs.forEach((e) => {
      const summaryUrl = new URL(e.summary, fixedConfigUrl).href;

      e.summaryData.forEach((item) => {
        const arr = fixSummaryHref(item, summaryUrl, url);
        flatLinks.push(...arr);
      });
    });

    let crawlerCode = ``;

    flatLinks.forEach((e) => {
      crawlerCode += `<li><a href="${e.relativePath}">${e.name}</a></li>\n`;
    });

    crawlerCode = `<ul>\n${crawlerCode}\n</ul>`;

    return crawlerCode;
  };

  const returnNormal = async ({ tokens, url, configUrl, configData }) => {
    let tempText = await fetch(`${host}/src/temps/page.html`).then((e) =>
      e.text()
    );
    let isDe1 = -1;
    const firstHeading = tokens.find((e, index) => {
      if (e.type === "heading" && e.depth === 1) {
        isDe1 = index;
      }
      return e.type === "heading";
    });

    if (isDe1 > -1) {
      tokens.splice(isDe1, 1);
    }

    const article = marked.parser(tokens);

    const injectHead = (await storage.getItem("inject-head")) || "";

    const data = {
      host,
      title: firstHeading.text,
      url,
      article,
      configUrl,
      injectHead,
      crawlerCode: getCrawlerCode({ configUrl, url, configData }),
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

  const returnRedirect = async ({ redirectTo, realUrl, url }) => {
    let tempText = await fetch(`${host}/src/temps/redirect.html`).then((e) =>
      e.text()
    );

    const relatePath = getRelativePath(
      url.replace(/(.+)\/.+/, "$1"),
      redirectTo
    );

    const data = {
      host,
      redirectTo: relatePath.replace(/\.md$/, ".html"),
    };

    // 替换模板内容
    Object.keys(data).forEach((name) => {
      const reg = new RegExp(`\<%${name}%\>`, "g");
      tempText = tempText.replace(reg, data[name]);
    });

    // 重定向地址到指定页面
    return new Response(tempText, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  };

  const responseMD = async (url, configUrl = "") => {
    const realUrl = url.replace("/@/", "/").replace(/html$/, "md");
    const realConfigUrl = new URL(configUrl, realUrl).href;
    const configData = await wrapFetch(realConfigUrl, "json");

    let isPage = false;
    if (configData.pages) {
      configData.pages.some((l) => {
        const fixedUrl = new URL(l, realConfigUrl).href;

        if (fixedUrl === realUrl) {
          return (isPage = true);
        }
      });
    }

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
      // 判断是不是 pages 的映射路径
      if (configData.pages) {
        const relateConfigUrl = new URL(configUrl, url).href;

        let redirectTo = null,
          afterUrl = null;
        configData.pages.some((l) => {
          const fixedUrl = new URL(l, relateConfigUrl).href;

          // 如果和修正目录一致，则则跳转到修正页面
          const farr = fixedUrl.split("/@/");
          if (farr.length === 2) {
            const pathArr = farr[1].split("/");
            if (pathArr.length >= 2) {
              const absUrl = [farr[0], ...pathArr.slice(1)].join("/");

              if (realUrl === absUrl) {
                redirectTo = fixedUrl;
                afterUrl = new URL(l, realConfigUrl).href;
                return true;
              }
            }
          }
        });

        if (redirectTo !== null) {
          return await returnRedirect({
            url,
            redirectTo,
            realUrl: afterUrl,
          });
        }
      }

      return new Response("", {
        status: 404,
      });
    }

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

    // 修正 navs 的数据
    await Promise.all(
      configData.navs.map(async (e) => {
        const summaryUrl = new URL(e.summary, realConfigUrl).href;

        e.summaryData = await getSummary(summaryUrl);
      })
    );

    if (isPage) {
      return await returnNormal({ url, configUrl, tokens, configData });
    }

    return await returnDocuments({ url, configUrl, tokens, configData });
  };

  return responseMD;
})();

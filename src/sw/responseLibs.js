const responseLibs = (() => {
  const main = async (configUrl) => {
    const realUrl = configUrl.replace("/@/", "/");

    const configData = await fetch(realUrl).then((e) => e.json());

    const libs = {};

    await Promise.all(
      configData.navs.map(async (e) => {
        const { summary } = e;

        const summaryUrl = new URL(summary, realUrl).href;

        const data = await getSummary(summaryUrl);

        const summaryRelate = removePrefixMatch(summaryUrl, realUrl);
        const dirs = summaryRelate.split("/").slice(0, -1);

        let navObj = libs;

        dirs.forEach((name) => {
          const newObj = (navObj[name] = {});
          navObj = newObj;
        });

        const initObjs = {};

        await Promise.all(
          data.map((e) => {
            return initArticle(initObjs, e, summaryUrl);
          })
        );

        // 重构后的对象
        // const navObj = {};

        Object.entries(initObjs).forEach(([path, data]) => {
          const pathArr = path.split("/");

          let targetObj = navObj;
          let name;
          for (let i = 0, len = pathArr.length; i < len; i++) {
            name = pathArr[i];

            if (i === len - 1) {
              break;
            }

            targetObj = targetObj[name] || (targetObj[name] = {});
          }

          name = name.replace(/\.md$/, "");

          targetObj[name] = data;
        });
      })
    );

    return new Response(JSON.stringify(libs), {
      status: 200,
    });
  };

  async function initArticle(obj, data, summaryUrl) {
    if (data.href) {
      const { href } = new URL(data.href, summaryUrl);

      const article = await fetch(href).then((e) => e.text());

      const tokens = marked.lexer(article);

      const articleObj = tokens
        .filter((e) => e.type !== "space")
        .map((e) => {
          let t;

          switch (e.type) {
            case "heading":
              t = "h";
              break;
            case "list":
              t = "l";
              break;
            case "paragraph":
              t = "p";
              break;
          }

          if (!t) {
            return 0;
          }

          return {
            t,
            c: removeMarkdownFormats(e.text || e.raw),
          };
        });

      const fileName = removePrefixMatch(href, summaryUrl);

      obj[fileName] = articleObj;
    } else if (data.childs) {
      await Promise.all(
        data.childs.map(async (e) => initArticle(obj, e, summaryUrl))
      );
    }
  }

  function removePrefixMatch(str1, str2) {
    const arr1 = str1.split("/");
    const arr2 = str2.split("/");

    let unarr = [];
    let isOK = false;

    arr1.forEach((item, index) => {
      if (item !== arr2[index]) {
        isOK = true;
      }

      if (isOK) {
        unarr.push(item);
      }
    });

    return unarr.join("/");
  }

  function removeMarkdownFormats(text) {
    // 去除链接格式 [text](url) 或 ![altText](imageUrl)
    const linkRegex = /\[([^\]]+)\]\([^)]+\)/g;
    const imageRegex = /!\[([^\]]+)\]\([^)]+\)/g;

    // 去除 `xx` 代码格式
    const codeRegex = /`([^`]+)`/g;

    // 去除加粗格式 **text** 或 __text__
    const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;

    // 去除斜体格式 *text* 或 _text_
    const italicRegex = /\*(.*?)\*|_(.*?)_/g;

    // 去除链接格式
    text = text.replace(linkRegex, "$1");
    text = text.replace(imageRegex, "$1");

    // 去除 `xx` 代码格式
    text = text.replace(codeRegex, "$1");

    // 去除加粗格式
    text = text.replace(boldRegex, "$1$2");

    // 去除斜体格式
    text = text.replace(italicRegex, "$1$2");

    return text;
  }

  return main;
})();

import { readDir, write } from "../BaseReader/index.mjs";
import translate from "./translate.js";

export default async function buildDoc({ configs, articles }) {
  const cacheDir = await readDir(configs.caches);

  const mainDocDir = await readDir(configs.dirs[configs.main]);

  // 读取 config.json
  let configData = await mainDocDir.read("config.json");
  configData = JSON.parse(configData);

  for (let [lang, entry] of Object.entries(configs.dirs)) {
    if (lang === configs.main) {
      continue;
    }

    // 翻译 config.json
    const entryDir = await readDir(entry, true);

    const cdata = JSON.parse(JSON.stringify(configData));

    let needWrite = true;

    // 查看旧的 config.json 是否存在或出现改动，如有变化就重新翻译写入
    let oldConfig = await entryDir.read("config.json");
    if (oldConfig) {
      oldConfig = JSON.parse(oldConfig);
      let isSame = oldConfig.navs.length === cdata.navs.length;
      oldConfig.navs.forEach((e, index) => {
        if (e.summary !== cdata.navs[index].summary) {
          isSame = false;
        }
      });

      if (isSame) {
        needWrite = false;
      }
    }

    if (needWrite) {
      // 不一样就要重新翻译
      await Promise.all(
        cdata.navs.map(async (e) => {
          const name = await translate({
            content: e.name,
            targetLang: lang,
            originLang: configs.main,
          });

          e.name = name;
        })
      );

      await entryDir.write("config.json", JSON.stringify(cdata));
    }

    const langDir = await cacheDir.read(lang);

    // 写入正文
    for (let p of Object.keys(articles)) {
      const path = `${entry}${p}`;

      let article = "";

      // 转换回翻译的正文
      for (let hash of articles[p]) {
        const e = await langDir.read(hash);

        article += /\n$/.test(e) ? e : e + "\n\n";
      }

      await write(path, article);
    }

    console.log(`${lang} document write complete`);
  }
}

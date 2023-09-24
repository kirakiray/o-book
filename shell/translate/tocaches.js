import translate from "./translate.js";
import { readDir } from "../BaseReader/index.mjs";

export default async function tocaches({ configs, hashObj }) {
  const cacheDir = await readDir(configs.caches, true);

  for (let lang of Object.keys(configs.dirs)) {
    if (lang === configs.main) {
      continue;
    }

    let langDir = await cacheDir.read(lang);

    if (!langDir) {
      langDir = await cacheDir.mkdir(lang, true);
    }

    const hashs = Object.keys(hashObj);

    // 已经翻译的个数
    let transedCount = 0;

    const names = await langDir.names();

    // 需要翻译的段落
    const needTransHashs = [];

    hashs.forEach((hash) => {
      if (names.includes(hash)) {
        transedCount++;
      } else {
        needTransHashs.push(hash);
      }
    });

    await new Promise((resolve) => {
      // let timer;
      // 当前并发数
      let concurrening = 0;
      // 最大并发数
      const maxConcurrening = configs.concurrent || 3;

      // 保持并发数进行翻译
      const f = () => {
        if (concurrening >= maxConcurrening) {
          return;
        }

        concurrening++;
        const targetHash = needTransHashs.shift();

        if (!targetHash) {
          if (transedCount === hashs.length) {
            // clearInterval(timer);
            resolve();
          }
          return;
        }

        const content = hashObj[targetHash];

        translate({
          content,
          targetLang: lang,
          originLang: configs.main,
        }).then((data) => {
          transedCount++;

          console.clear();
          console.log(`翻译${lang}段落中 : ${transedCount} / ${hashs.length}`);

          langDir.write(targetHash, data);

          concurrening--;

          f();
        });

        f();
      };

      // 点火
      f();

      // 保证不熄火机制
      // timer = setInterval(f, 100);
    });

    // 判断要删除的
    const needDelete = names.filter((e) => !hashs.includes(e));

    await Promise.all(
      needDelete.map(async (name) => {
        await langDir.remove(name);
      })
    );

    if (needDelete.length) {
      console.log(`已删除 ${needDelete.length} 个无用段落`);
    }

    console.log(`${lang} 段落数据翻译完成`);
  }
}

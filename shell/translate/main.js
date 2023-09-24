import path from "path";
import { readDir } from "../BaseReader/index.mjs";
import tocaches from "./tocaches.js";
import buildDoc from "./build.js";
import { getHashLineData } from "./util.mjs";

export default async function trans(configs) {
  if (!configs.caches) {
    console.error(
      `caches 目录是必须的，请配置caches目录；缓存能大幅减少 openai 的花费；`
    );
    return;
  }

  if (!configs.dirs) {
    console.error(`dirs 字段是必需的；它代表各个语言的文档存放目录。`);
    return;
  }

  if (!configs.main) {
    console.error(
      `main 字段是必需的；它代表将哪个语言的目录翻译到其他语言的目录。`
    );
    return;
  }

  // 先修正所有地址
  configs.caches = path.resolve(process.env.PWD, configs.caches);

  for (let [k, value] of Object.entries(configs.dirs)) {
    configs.dirs[k] = path.resolve(process.env.PWD, value);
  }

  const mainLangDir = configs.dirs[configs.main];

  const { hashObj, articles } = await getHashLineData(
    await readDir(mainLangDir)
  );

  await tocaches({ configs, hashObj });

  await buildDoc({ configs, articles });

  console.log(`文档翻译完毕`);
}

// setTimeout(() => {}, 10000000);

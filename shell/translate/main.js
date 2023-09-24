import path from "path";
import { readDir } from "../BaseReader/index.mjs";
import tocaches from "./tocaches.js";
import buildDoc from "./build.js";
import { getHashLineData } from "./util.mjs";

export default async function trans(configs) {
  if (!configs.caches) {
    console.error(
      `The 'caches' field is required, please configure the caches directory; caching reduces openai spend significantly;`
    );
    return;
  }

  if (!configs.dirs) {
    console.error(
      `The 'dirs' field is required; it represents the directory where the documentation for each language is stored.`
    );
    return;
  }

  if (!configs.main) {
    console.error(
      `The 'main' field is required; it represents which language's directory will be translated to the other language's directory.`
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

  console.log(`Documentation translated.`);
}

// setTimeout(() => {}, 10000000);

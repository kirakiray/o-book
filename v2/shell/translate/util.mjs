import crypto from "crypto";
import { marked } from "marked";

// 获取所有的正文内容，并进行哈希匹配
export const getHashLineData = async (
  inputer,
  path = "",
  hashObj = {},
  articles = {}
) => {
  const names = await inputer.names();
  for (let name of names) {
    const data = await inputer.read(name);

    if (data.name) {
      await getHashLineData(data, `${path}/${name}`, hashObj, articles);
      continue;
    }

    if (!/\.md$/.test(name)) {
      continue;
    }

    let t = "";

    marked.lexer(data).forEach((e) => {
      t += e.raw;
    });

    // 去除无用行数
    // const mdDatas = marked.lexer(data).filter((e) => e.type !== "space");
    const mdDatas = marked.lexer(data);

    const articleHash = [];

    for (let e of mdDatas) {
      const { raw } = e;
      const hash = calculateHash(raw);
      hashObj[hash] = raw;
      articleHash.push(hash);
    }

    articles[`${path}/${name}`] = articleHash;
  }

  return { hashObj, articles };
};

function calculateHash(str) {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}

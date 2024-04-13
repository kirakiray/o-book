import { currentData } from "../../src/data.js";

// 保存段落数据
export const savePart = async ({ lang, hash, content }) => {
  const caches = await currentData.handle.get("_caches", {
    create: "directory",
  });

  const targetLangDir = await caches.get(lang, {
    create: "directory",
  });

  const targetFile = await targetLangDir.get(hash, {
    create: "file",
  });

  await targetFile.write(content);

  return true;
};

// 获取段落数据
export const getPart = async ({ lang, hash }) => {
  const caches = await currentData.handle.get("_caches", {
    create: "directory",
  });

  const targetLangDir = await caches.get(lang, {
    create: "directory",
  });

  const targetFile = await targetLangDir.get(hash).catch(() => null);

  if (!targetFile) {
    return null;
  }

  return await targetFile.text();
};

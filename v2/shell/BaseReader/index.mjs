import BaseReader from "./base.mjs";

export { BaseReader };

// 底部兼容层，方便以后迁移到浏览器
export async function readDir(path, bool = false) {
  return new BaseReader(path, bool);
}

export async function write(path, content) {
  const dirpath = path.replace(/(.+)\/(.+)/, "$1");
  const name = path.replace(/(.+)\/(.+)/, "$2");

  const reader = new BaseReader(dirpath, true);

  return await reader.write(name, content);
}

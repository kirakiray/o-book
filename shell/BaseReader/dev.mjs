import path from "path";
import { fileURLToPath } from "url";
import BaseReader from "./base.mjs";

const __filename = fileURLToPath(import.meta.url);
const entryDir = path.resolve(__filename, "../test");
console.log(entryDir);

const testBase = async () => {
  const reader = new BaseReader(entryDir);

  console.log("parent: ", reader.parent);

  console.log("names: ", await reader.names());

  console.log("bbb:", await reader.read("bbb"));
  console.log("ddd:", await reader.read("ddd", true));

  const r = Math.random();
  console.log("eee: ", r, await reader.write("eee.md", `# I am ddd ${r}`));

  console.log(
    "rename: ",
    await reader.move("eee.md", "eee2.md").catch(() => "exists!!")
  );

  console.log(await reader.remove("eee2.md"));

  const fdir = await reader.mkdir("fff", true);
  await fdir.write("f2.md", "# f22222222 " + Math.random());
  const haha = await fdir.mkdir("haha");
  await haha.write("h1", "hahahahhaha");

  // 目录重命名
  console.log("fff2:", await reader.move("fff", "fff2"));

  setTimeout(() => {
    reader.remove("fff2", true);
  }, 2000);
};

setTimeout(() => {}, 10000000);
setTimeout(testBase, 3000);

import fs from "fs";
import path from "path";

// 递归遍历目录
async function traverseDirectory(directoryPath) {
  const files = await fs.promises.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && !file.startsWith(".")) {
        await traverseDirectory(filePath);
      }
    } else {
      await processFile(filePath);
    }
  }
}

// 处理文件内容
async function processFile(filePath) {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");
  //   const reg = /o-book@2\.0\.8/g;
  const reg = new RegExp(`o-book@${oldVer}`);
  if (reg.test(fileContent)) {
    const updatedContent = fileContent.replace(reg, `o-book@${newVer}`);

    await fs.promises.writeFile(filePath, updatedContent, "utf-8");

    console.log(`Updated: ${filePath}`);
  }
}

function upgradeVersion(version) {
  // 将版本号字符串拆分为数组，以便逐个处理每个部分
  const parts = version.split(".");

  // 将最后一个部分（即最后的修订号）转换为数字，并加一
  const lastPart = parseInt(parts[2]) + 1;

  // 将新的修订号放回数组
  parts[2] = lastPart.toString();

  // 重新组合版本号并返回
  const upgradedVersion = parts.join(".");
  return upgradedVersion;
}

// 读取当前包的版本
let pjson = fs.readFileSync(
  path.resolve(process.env.PWD, "./package.json"),
  "utf-8"
);
pjson = JSON.parse(pjson);
const oldVer = pjson.version;
const newVer = (pjson.version = upgradeVersion(oldVer));

fs.writeFileSync(
  path.resolve(process.env.PWD, "./package.json"),
  JSON.stringify(pjson)
);

traverseDirectory(process.env.PWD)
  .then(() => {
    console.log("Finished updating files.");
  })
  .catch((err) => {
    console.error("Error:", err);
  });

import fs from "fs";
import path from "path";
import { exec } from "child_process";

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
    } else if (!file.startsWith(".")) {
      await processFile(filePath);
    }
  }
}

let lastVer = "";

// 处理文件内容
async function processFile(filePath) {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");
  const reg = /obook@\d\.\d\.\d/g;
  if (reg.test(fileContent)) {
    const updatedContent = fileContent.replace(reg, `obook@${lastVer}`);

    await fs.promises.writeFile(filePath, updatedContent, "utf-8");

    console.log(`Updated: ${filePath}`);
  }

  if (/package\.json$/.test(filePath)) {
    const jdata = JSON.parse(fileContent);

    let hasChange = false;
    if (jdata.dependencies && jdata.dependencies.obook) {
      jdata.dependencies.obook = `^${lastVer}`;
      hasChange = true;
    }

    if (jdata.devDependencies && jdata.devDependencies.obook) {
      jdata.devDependencies.obook = `^${lastVer}`;
      hasChange = true;
    }

    if (hasChange) {
      await fs.promises.writeFile(filePath, JSON.stringify(jdata), "utf-8");
    }
  }
}

export default async function update({ obook }) {
  lastVer = await new Promise((res, rej) => {
    exec(`npm view obook version`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        rej();
        return;
      }
      if (stderr) {
        console.error(`command error: ${stderr}`);
        rej();
        return;
      }

      // stdout包含了最新版本号
      const latestVersion = stdout.trim();

      res(latestVersion);
    });
  });

  await traverseDirectory(process.cwd());
}

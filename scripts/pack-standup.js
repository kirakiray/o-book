import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

/**
 * 递归地将目录下的所有文件和子目录打包成 zip 并覆盖到另一个目录
 * @param {string} sourceDirectory - 源目录的路径
 * @param {string} outputZipPath - 输出目录的路径
 */

async function zipDirectory(sourceDirectory, outputZipPath) {
  try {
    // 创建一个新的 AdmZip 实例
    const zip = new AdmZip();

    // 递归读取目录中的文件和子目录
    function readDirectory(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          // 如果是文件，将文件添加到 zip 中，使用相对路径
          zip.addFile(
            path.relative(sourceDirectory, filePath),
            fs.readFileSync(filePath)
          );
        } else if (stats.isDirectory()) {
          // 如果是目录，递归读取目录中的文件和子目录
          readDirectory(filePath);
        }
      }
    }

    // 开始读取目录
    readDirectory(sourceDirectory);

    // 将 zip 内容写入输出文件
    zip.writeZip(outputZipPath);

    console.log(`目录 "${sourceDirectory}" 已成功打包为 "${outputZipPath}"`);
  } catch (error) {
    console.error("打包目录出错:", error);
  }
}

zipDirectory(
  `${process.env.PWD}/init-files/stand-up/`,
  `${process.env.PWD}/docs/publics/stand-up.zip`
);

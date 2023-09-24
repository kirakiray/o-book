import fs from "fs/promises";

export default class BaseReader {
  constructor(path, recursive) {
    let resolve, reject;

    Object.defineProperties(this, {
      path: {
        value: path,
      },
      loaded: {
        value: new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        }),
      },
    });

    (async () => {
      const stat = await fs.stat(path).catch(() => null);

      if (stat) {
        resolve();
        return;
      }

      if (recursive) {
        // 确保目录存在
        const paths = path.split("/");

        let tartPath = "";
        for (let e of paths) {
          tartPath += e + "/";

          const stat2 = await fs.stat(tartPath).catch(() => null);

          if (!stat2) {
            await fs.mkdir(tartPath);
          }
        }

        resolve();
        return;
      }

      const desc = `Directory does not exist: ${path}`;
      console.log("Directory does not exist, reader is invalid", this);
      reject(desc);
      throw new Error(desc);
    })();
  }

  get name() {
    return this.path.replace(/.+\/(.+)/, "$1");
  }

  // 上一级目录
  get parent() {
    return new BaseReader(this.path.replace(/(.+)\/.+/, "$1"));
  }

  async names() {
    await this.loaded;
    return fs.readdir(this.path);
  }

  async stat(name) {
    await this.loaded;
    return await fs.stat(`${this.path}/${name}`).catch(() => null);
  }

  // 读取文件或目录
  async read(name, options) {
    await this.loaded;
    const childPath = `${this.path}/${name}`;
    const childStats = await this.stat(name);

    if (childStats) {
      if (childStats.isFile()) {
        const encoding =
          options && typeof options === "string" ? options : "utf-8";
        return fs.readFile(childPath, encoding);
      } else {
        return new BaseReader(childPath);
      }
    }

    if (options === true) {
      // 是目录，如果不存在的情况下就创建
      await fs.mkdir(childPath);
      return new BaseReader(childPath);
    }

    return null;
  }

  // 写入文件
  async write(name, content, binary = "utf-8") {
    await this.loaded;
    await fs.writeFile(`${this.path}/${name}`, content, binary);

    return true;
  }
  // 写入目录
  async mkdir(name, recursive = false) {
    await this.loaded;
    const path = `${this.path}/${name}`;
    const stat = await this.stat(name);

    if (stat) {
      if (recursive) {
        await fs.rm(path, { recursive });
      } else {
        throw new Error(`${path} already exists`);
      }
    }

    await fs.mkdir(path);

    return this.read(name);
  }

  // 剪切或更换名字
  async move(name, newName, targetReader = this) {
    await this.loaded;
    if (targetReader === this && name === newName) {
      return true;
    }

    // 确认将要命名的地方不存在同名的文件
    const targetStat = await targetReader.stat(newName);

    const sourcePath = `${this.path}/${name}`;
    const destinationPath = `${targetReader.path}/${newName}`;

    if (targetStat) {
      throw new Error(`${destinationPath} already exists`);
    }

    const stat = await this.stat(name);

    if (!stat) {
      throw new Error(`${sourcePath} Not present`);
    }

    if (stat.isFile()) {
      await fs.rename(sourcePath, destinationPath);

      return true;
    } else {
      await moveDir(await this.read(name), await targetReader.mkdir(newName));

      return targetReader.read(newName);
    }
  }

  // 删除文件或目录
  async remove(name) {
    await this.loaded;
    await fs.rm(`${this.path}/${name}`, { recursive: true });

    return true;
  }
}

async function moveDir(current, target) {
  const names = await current.names();

  await Promise.all(
    names.map(async (name) => {
      const stat = await current.stat(name);

      if (stat.isFile()) {
        await fs.rename(`${current.path}/${name}`, `${target.path}/${name}`);
      } else {
        await moveDir(await current.read(name), await target.mkdir(name, true));
      }
    })
  );

  await fs.rmdir(current.path);
}

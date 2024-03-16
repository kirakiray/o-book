// 创建虚拟md服务器

import yaml from "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.mjs";
import {
  statics,
  config as configTask,
  articleTask,
  respPage,
} from "./tasks.js";
import { getSummarys, getAllArticles } from "./util.js";

const load = lm(import.meta);

export const create = async ({ handle, temp }) => {
  const server = new MdServer({
    handle,
    temp,
  });

  await server.init();

  return server;
};

export class MdServer {
  constructor({ handle, temp }) {
    this._handle = handle;
    this.articleTemp = temp;
  }

  async init() {
    const handle = this._handle;

    const allDatas = [];

    for await (let [name, subHandle] of handle.entries()) {
      if (subHandle.kind === "directory" && !/^_/.test(name)) {
        const navData = await this._getNavData(subHandle);
        allDatas.push({
          lang: name,
          data: navData,
          // 所有文章的文本数据，给搜索用的
          articles: await getAllArticles(subHandle),
        });
      }
    }

    this._allDatas = allDatas;

    console.log("all: ", allDatas);

    await this._initServer();
  }

  async _getNavData(handle) {
    const summarys = await getSummarys(handle);

    const configData = await handle.get("config.yaml").then((e) => e.text());

    return {
      configData: yaml.load(configData),
      summarys,
    };
  }

  async _initServer() {
    const { createApi } = await load("@nos/core/virtual.js");

    const _this = this;
    this.server = await createApi({
      name: this._handle.name,
      async callback({ request, search, pathname, searchParams, hash }) {
        console.log(request, search, pathname, searchParams, hash);

        const path = pathname.replace(/^\//, "");

        for (let task of [statics, configTask, articleTask, respPage]) {
          const result = await task({
            path,
            all: _this._allDatas,
            handle: _this._handle,
            // temp: _this.articleTemp,
            temp: await fetch("/statics/index.html").then((e) => e.text()),
          });

          if (result) {
            return result;
          }
        }

        return null;
      },
    });

    // console.log(`${location.origin}${this.server.path}/cn/index.html`);
  }

  get path() {
    return this.server.path;
  }
}

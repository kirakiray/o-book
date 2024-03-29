class XDStorage {
  constructor(id) {
    this._id = id;
    this._initdb();
  }
  _initdb() {
    this.dbPms = new Promise((resolve) => {
      // 根据id获取数据库
      let req = indexedDB.open(this._id);

      req.onsuccess = (e) => {
        //获取数据库
        let db = e.target.result;

        db.onclose = () => {
          this._initdb();
        };

        resolve(db);
      };

      // 创建时生成仓库
      req.onupgradeneeded = (e) => {
        // 保存 IDBDataBase 接口
        let db = e.target.result;

        db.onclose = () => {
          this._initdb();
        };

        // 为该数据库创建一个对象仓库
        db.createObjectStore("main", { keyPath: "key" });
      };

      req.onerror = (event) => {
        throw {
          desc: "数据创建出错",
          event,
        };
      };
    });
  }
  async clear() {
    let db = await this.dbPms;

    return new Promise((resolve, reject) => {
      let req = db
        .transaction(["main"], "readonly")
        .objectStore("main")
        .getAllKeys();

      req.onsuccess = (e) => {
        let keys = e.target.result;

        if (keys) {
          this.removeItem(keys).then(resolve).catch(reject);
        }
      };
      req.onerror = (e) => {
        reject(e);
      };
    });
  }
  async getItem(key) {
    let db = await this.dbPms;

    return new Promise((resolve, reject) => {
      let req = db
        .transaction(["main"], "readonly")
        .objectStore("main")
        .get(key);

      req.onsuccess = (e) => {
        let { result } = e.target;
        resolve(result ? result.value : undefined);
      };
      req.onerror = (e) => {
        reject(e);
      };
    });
  }
  async setItem(key, value) {
    let db = await this.dbPms;

    return new Promise((resolve, reject) => {
      let req = db
        .transaction(["main"], "readwrite")
        .objectStore("main")
        .put({ key, value });

      req.onsuccess = (e) => {
        resolve(true);
      };
      req.onerror = (e) => {
        reject(e);
      };
    });
  }
  async removeItem(key) {
    let db = await this.dbPms;

    return new Promise((resolve, reject) => {
      let req = db.transaction(["main"], "readwrite").objectStore("main");

      req.onsuccess = (e) => {
        resolve(true);
      };
      req.onerror = (e) => {
        reject(e);
      };

      if (key instanceof Array) {
        key.forEach((k) => req.delete(k));
      } else {
        req.delete(key);
      }
    });
  }
  async getLength() {
    let db = await this.dbPms;

    return new Promise((resolve, reject) => {
      let req = db
        .transaction(["main"], "readonly")
        .objectStore("main")
        .getAllKeys();

      req.onsuccess = (e) => {
        let keys = e.target.result;

        if (keys) {
          resolve((keys && keys.length) || 0);
        }
      };
      req.onerror = (e) => {
        reject(e);
      };
    });
  }
  async getAll() {
    let db = await this.dbPms;

    return new Promise((resolve, reject) => {
      let req = db
        .transaction(["main"], "readonly")
        .objectStore("main")
        .getAll();

      req.onsuccess = (e) => {
        resolve(req.result);
      };
      req.onerror = (e) => {
        reject(e);
      };
    });
  }
}

const globalStorage = new XDStorage("public");

// 设置全局性获取参数
globalStorage.getStorage = (id) => id && new XDStorage(id);

export default globalStorage;

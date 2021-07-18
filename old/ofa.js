/*!
 * ofa v2.9.0
 * https://github.com/kirakiray/ofa.js
 * 
 * (c) 2018-2021 YAO
 * Released under the MIT License.
 */
((glo) => {
    "use strict";
    /*!
     * xhear v5.4.0
     * https://github.com/kirakiray/Xhear#readme
     * 
     * (c) 2018-2021 YAO
     * Released under the MIT License.
     */
    ((glo) => {
        "use strict";
        const getRandomId = () => Math.random().toString(32).substr(2);
        let objectToString = Object.prototype.toString;
        const getType = value => objectToString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
        const isUndefined = val => val === undefined;
        const isFunction = val => getType(val).includes("function");
        const cloneObject = obj => obj instanceof XData ? obj.object : JSON.parse(JSON.stringify(obj));

        const nextTick = (() => {
            let isDebug = document.currentScript.getAttribute("debug") !== null;
            if (isDebug) {
                let nMap = new Map();
                return (fun, key) => {
                    if (!key) {
                        key = getRandomId();
                    }

                    let timer = nMap.get(key);
                    clearTimeout(timer);
                    nMap.set(key, setTimeout(() => {
                        fun();
                        nMap.delete(key);
                    }));
                };
            }

            // 定位对象寄存器
            let nextTickMap = new Map();

            let pnext = (func) => Promise.resolve().then(() => func())

            if (typeof process === "object" && process.nextTick) {
                pnext = process.nextTick;
            }

            let inTick = false;
            return (fun, key) => {
                if (!key) {
                    key = getRandomId();
                }

                nextTickMap.set(key, {
                    key,
                    fun
                });

                if (inTick) {
                    return;
                }

                inTick = true;

                pnext(() => {
                    if (nextTickMap.size) {
                        nextTickMap.forEach(({
                            key,
                            fun
                        }) => {
                            try {
                                fun();
                            } catch (e) {
                                console.error(e);
                            }
                            nextTickMap.delete(key);
                        });
                    }

                    nextTickMap.clear();
                    inTick = false;
                });
            };
        })();

        // 触发update事件
        const emitUpdate = (target, name, args, assingData, beforeCall) => {
            let mid;

            if (target._modifyId) {
                mid = target._modifyId;
            } else {
                mid = getRandomId();
            }

            getXDataProp(target, MODIFYIDS).push(mid);
            recyclModifys(target);

            // 事件冒泡
            let event = new XEvent({
                type: "update",
                target: target[PROXYTHIS] || target
            });

            Object.defineProperties(event, {
                trend: {
                    get() {
                        return new XDataTrend(event);
                    }
                }
            });

            assingData && Object.assign(event, assingData);

            // 设置modify数据
            event.modify = {
                name,
                args: args.map(e => {
                    if (e instanceof XData) {
                        return e.object;
                    } else if (e instanceof Object) {
                        return cloneObject(e);
                    }
                    return e;
                }),
                mid
            };

            beforeCall && (beforeCall(event));

            // 冒泡update
            target.emit(event);
        }

        // 清理modifys
        let recyTimer, recyArr = new Set();
        const recyclModifys = (xobj) => {
            // 不满50个别瞎折腾
            if (xobj[MODIFYIDS].length < 50) {
                return;
            }

            clearTimeout(recyTimer);
            recyArr.add(xobj);
            recyTimer = setTimeout(() => {
                let copyRecyArr = Array.from(recyArr);
                setTimeout(() => {
                    copyRecyArr.forEach(e => recyclModifys(e));
                }, 1000);
                recyArr.forEach(e => {
                    let modifys = e[MODIFYIDS]
                    // 清除掉一半
                    modifys.splice(0, Math.ceil(modifys.length / 2));
                });
                recyArr.clear();
            }, 3000)
        }

        const clearXMirror = (xobj) => {
            xobj.index = undefined;
            xobj.parent = undefined;
            // xobj[XMIRROR_SELF].mirrorHost.off("update", xobj[XMIRRIR_BIND_UPDATA]);
            xobj[XMIRROR_SELF].mirrorHost.off("update", xobj[XMIRRIR_UPDATA_BINDER]);
            xobj[XMIRROR_SELF].mirrorHost = undefined;
        }

        // 清理XData数据
        const clearXData = (xobj) => {
            if (xobj instanceof XMirror) {
                clearXMirror(xobj);
                return;
            }
            if (!(xobj instanceof XData)) {
                return;
            }
            let _this = xobj[XDATASELF];
            if (_this) {
                try {
                    // 防止index和parent被重定向导致失败
                    _this.index = undefined;
                    _this.parent = undefined;
                } catch (e) {}
            }

            // 解除virData绑定
            // if (xobj instanceof VirData) {
            //     let { mappingXData } = xobj;
            //     let tarHostData = mappingXData[VIRDATAHOST].find(e => e.data === _this);
            //     let { leftUpdate, rightUpdate } = tarHostData;
            //     xobj.off("update", rightUpdate);
            //     mappingXData.off("update", leftUpdate);
            //     _this.mappingXData = null;
            // }

            // 清除sync
            if (_this[SYNCSHOST]) {
                for (let [oppXdata, e] of _this[SYNCSHOST]) {
                    xobj.unsync(oppXdata);
                }
            }

            // if (_this[VIRDATAHOST]) {
            //     _this[VIRDATAHOST].forEach(e => {
            //         let { data, leftUpdate, rightUpdate } = e;
            //         data.off("update", rightUpdate);
            //         _this.off("update", leftUpdate);
            //         data.mappingXData = null;
            //     });
            //     _this[VIRDATAHOST].splice(0);
            // }

            // 触发清除事件
            _this.emit("clearxdata");

            _this[WATCHHOST] && _this[WATCHHOST].clear();
            _this[EVENTS] && _this[EVENTS].clear();
            // _this[WATCHEXPRHOST] && _this[WATCHEXPRHOST].clear();

            // 子数据也全部回收
            // Object.keys(_this).forEach(key => {
            //     let val = _this[key];
            //     if (/\D/.test(key) && val instanceof XData) {
            //         clearXData(val);
            //     }
            // });
            // _this.forEach(e => clearXData(e));
        }

        /**
         * 生成XData数据
         * @param {Object} obj 对象值，是Object就转换数据
         * @param {Object} options 附加信息，记录相对父层的数据
         */
        const createXData = (obj, options) => {
            if (obj instanceof XMirror) {
                return obj;
            }
            let redata = obj;
            switch (getType(obj)) {
                case "object":
                case "array":
                    redata = new XData(obj, options);
                    break;
            }

            return redata;
        };

        /**
         * 将 stanz 转换的对象再转化为 children 结构的对象
         * @param {Object} obj 目标对象
         * @param {String} childKey 数组寄存属性
         */
        const toNoStanz = (obj, childKey) => {
            if (obj instanceof Array) {
                return obj.map(e => toNoStanz(e, childKey));
            } else if (obj instanceof Object) {
                let newObj = {};
                let childs = [];
                Object.keys(obj).forEach(k => {
                    if (!/\D/.test(k)) {
                        childs.push(toNoStanz(obj[k], childKey));
                    } else {
                        newObj[k] = toNoStanz(obj[k]);
                    }
                });
                if (childs.length) {
                    newObj[childKey] = childs;
                }
                return newObj;
            } else {
                return obj;
            }
        }

        // common
        const EVENTS = Symbol("events");

        // 获取事件队列
        const getEventsArr = (eventName, tar) => {
            let eventHost = tar[EVENTS];

            if (!eventHost) {
                eventHost = new Map();
                Object.defineProperty(tar, EVENTS, {
                    value: eventHost
                });
            }

            let tarEves = eventHost.get(eventName);
            if (!tarEves) {
                tarEves = [];
                eventHost.set(eventName, tarEves);
            }
            return tarEves;
        };

        /**
         * 转换为事件对象
         * @param {String|XEvent} eventName 事件对象或事件名
         * @param {Object} _this 目标元素
         */
        const transToEvent = (eventName, _this) => {
            let event;
            // 不是实例对象的话，重新生成
            if (!(eventName instanceof XEvent)) {
                event = new XEvent({
                    type: eventName,
                    target: _this[PROXYTHIS] || _this
                });
            } else {
                event = eventName;
                eventName = event.type;
            }
            return event;
        }

        /**
         * 事件触发器升级版，可设置父节点，会模拟冒泡操作
         * @class XEmiter
         * @constructor
         * @param {Object} options 
         */
        class XEmiter {
            constructor(options = {}) {
                Object.defineProperties(this, {
                    // 记录事件用的Map对象
                    // [EVENTS]: {
                    //     value: new Map()
                    // },
                    // 父对象
                    parent: {
                        writable: true,
                        value: options.parent,
                        configurable: true
                    },
                    index: {
                        writable: true,
                        value: options.index,
                        configurable: true
                    }
                });
            }

            /**
             * 注册事件
             * @param {String} type 注册的事件名
             * @param {Function} callback 注册事件的回调函数
             * @param {Object} data 注册事件的自定义数据
             */
            on(type, callback, data) {
                this.addListener({
                    type,
                    data,
                    callback
                });
            }

            /**
             * 注册一次性事件
             * @param {String} type 注册的事件名
             * @param {Function} callback 注册事件的回调函数
             * @param {Object} data 注册事件的自定义数据
             */
            one(type, callback, data) {
                this.addListener({
                    count: 1,
                    type,
                    data,
                    callback
                });
            }

            /**
             * 外部注册事件统一到内部的注册方法
             * @param {Object} opts 注册事件对象参数
             */
            addListener(opts = {}) {
                let {
                    type,
                    data,
                    callback,
                    // 事件可触发次数
                    count = Infinity,
                    eventId
                } = opts;

                if (!type) {
                    throw {
                        desc: "addListener no type",
                        options: opts
                    };
                }

                // 分解id参数
                let spIdArr = type.split('#');
                if (1 in spIdArr) {
                    type = spIdArr[0];
                    eventId = spIdArr[1];
                }

                let evesArr = getEventsArr(type, this);

                if (!isUndefined(eventId)) {
                    // 判断是否存在过这个id的事件注册过
                    // 注册过这个id的把旧的删除
                    Array.from(evesArr).some((opt) => {
                        // 想等值得删除
                        if (opt.eventId === eventId) {
                            let id = evesArr.indexOf(opt);
                            if (id > -1) {
                                evesArr.splice(id, 1);
                            }
                            return true;
                        }
                    });
                }

                callback && evesArr.push({
                    type,
                    data,
                    callback,
                    eventId,
                    count
                });
            }

            /**
             * 注销事件
             * @param {String} eventName 需要注销的事件名
             * @param {Function} callback 注销的事件函数
             */
            off(eventName, callback) {
                if (!eventName) {
                    return;
                }
                if (callback) {
                    let evesArr = getEventsArr(eventName, this);
                    let tarId = evesArr.findIndex(e => e.callback == callback);
                    (tarId > -1) && evesArr.splice(tarId, 1);
                } else {
                    // this[EVENTS] && this[EVENTS].delete(eventName);
                    // 防止误操作，必须填入event
                    throw {
                        desc: `off must have callback`
                    };
                }
            }

            /**
             * 触发事件
             * 不会触发冒泡
             * @param {String|XEvent} eventName 触发的事件名
             * @param {Object} emitData 触发事件的自定义数据
             */
            emitHandler(eventName, emitData) {
                let event = transToEvent(eventName, this);
                eventName = event.type;

                let evesArr = getEventsArr(eventName, this);

                // 需要去除的事件对象
                let needRmove = [];

                // 修正currentTarget
                event.currentTarget = this[PROXYTHIS] || this;

                // 触发callback函数
                evesArr.some(e => {
                    e.data && (event.data = e.data);
                    e.eventId && (event.eventId = e.eventId);

                    // 中转确认对象
                    let middleObj = {
                        self: this,
                        event,
                        emitData
                    };

                    let isRun = e.before ? e.before(middleObj) : 1;

                    isRun && e.callback.call(this[PROXYTHIS] || this, event, emitData);

                    e.after && e.after(middleObj);

                    delete event.data;
                    delete event.eventId;

                    e.count--;

                    if (!e.count) {
                        needRmove.push(e);
                    }

                    if (event.cancel) {
                        return true;
                    }
                });

                delete event.currentTarget;

                // 去除count为0的事件记录对象
                needRmove.forEach(e => {
                    let id = evesArr.indexOf(e);
                    (id > -1) && evesArr.splice(id, 1);
                });

                return event;
            }

            /**
             * 触发事件
             * 带有冒泡状态
             * @param {String|XEvent} eventName 触发的事件名
             * @param {Object} emitData 触发事件的自定义数据
             */
            emit(eventName, emitData) {
                let event = this.emitHandler(eventName, emitData);

                // 判断父层并冒泡
                if (event.bubble && !event.cancel) {
                    let {
                        parent
                    } = this;

                    if (parent) {
                        event.keys.unshift(this.index);
                        parent.emit(event, emitData);
                    }
                }
            }
        }

        /**
         * 事件记录对象
         * @class XEvent
         * @constructor
         * @param {String} type 事件名称
         */
        class XEvent extends XEmiter {
            constructor(opt) {
                super();
                this.type = opt.type;
                this.target = opt.target;
                this._bubble = true;
                this._cancel = false;
                this.keys = [];
            }

            get bubble() {
                return this._bubble;
            }
            set bubble(val) {
                if (this._bubble === val) {
                    return;
                }
                this.emitHandler(`set-bubble`, val);
                this._bubble = val;
            }
            get cancel() {
                return this._cancel;
            }
            set cancel(val) {
                if (this._cancel === val) {
                    return;
                }
                this.emitHandler(`set-cancel`, val);
                this._cancel = val;
            }
        }

        // get 可直接获取的正则
        // const GET_REG = /^_.+|^parent$|^index$|^length$|^object$/;
        const GET_REG = /^_.+|^index$|^length$|^object$|^getData$|^setData$/;
        // set 不能设置的Key的正则
        const SET_NO_REG = /^parent$|^index$|^length$|^object$/

        let XDataHandler = {
            get(target, key, receiver) {
                // 私有变量直接通过
                if (typeof key === "symbol" || GET_REG.test(key)) {
                    return Reflect.get(target, key, receiver);
                }

                return target.getData(key);
            },
            set(target, key, value, receiver) {
                // 私有变量直接通过
                // 数组函数运行中直接通过
                if (typeof key === "symbol") {
                    return Reflect.set(target, key, value, receiver);
                }

                return target.setData(key, value)
            }
        };

        const PROXYTHIS = Symbol("proxyThis");

        // 未Proxy时的自身
        const XDATASELF = Symbol("XDataSelf");

        // watch寄存数据
        const WATCHHOST = Symbol("WatchHost");

        // modifyId寄存
        const MODIFYIDS = Symbol("ModifyIDS");

        // sync寄存
        const SYNCSHOST = Symbol("SyncHost");

        // virData寄存器
        // const VIRDATAHOST = Symbol("VirDataHost");

        // watchExpr寄存器
        // const WATCHEXPRHOST = Symbol("watchExprHost");

        const STANZID = Symbol("StanzID");


        /**
         * 获取对象内置数据
         * 这个操作是为了节省内存用的
         * @param {XData} target 目标元素
         * @param {Symbol} key 需要获取的元素key
         */
        const getXDataProp = (target, key) => {
            let value = target[key];

            if (!value) {
                switch (key) {
                    case WATCHHOST:
                    case SYNCSHOST:
                        value = new Map();
                        break;
                    case MODIFYIDS:
                    case VIRDATAHOST:
                        value = [];
                        break;
                }
                Object.defineProperty(target, key, {
                    value
                });
            }

            return value;
        }

        const hasElement = typeof Element !== "undefined";

        /**
         * 事件触发器升级版，可设置父节点，会模拟冒泡操作
         * @class
         * @constructor
         * @param {Object} obj 合并到实例上的数据对象
         * @param {Object} opts 合并选项
         * @returns {ArrayLike} 当前实例，会根据XData上的
         */
        class XData extends XEmiter {
            constructor(obj, opts = {}) {
                super(opts);

                let proxyThis = new Proxy(this, XDataHandler);

                // 重新计算当前数据的数组长度
                let length = 0;

                // 数据合并
                // Object.keys(obj).forEach(k => {
                let descsObj = Object.getOwnPropertyDescriptors(obj);
                Object.keys(descsObj).forEach(k => {
                    // let value = obj[k];
                    let {
                        value,
                        get,
                        set
                    } = descsObj[k];

                    if (get || set) {
                        Object.defineProperty(this, k, {
                            configurable: true,
                            enumerable: true,
                            get,
                            set,
                        });
                        return;
                    } else if (/^\_/.test(k) || (hasElement && value instanceof Element)) {
                        // this[k] = obj[k];
                        Object.defineProperty(this, k, {
                            configurable: true,
                            writable: true,
                            value
                        });
                        return;
                    }

                    if (!/\D/.test(k)) {
                        // 数字key进行length长度计算
                        k = parseInt(k);

                        if (k >= length) {
                            length = k + 1;
                        }
                    }

                    if (value instanceof XMirror) {
                        this[k] = value;
                        value.parent = this;
                        value.index = k;
                    } else if (value instanceof Object) {
                        this[k] = new XData(value, {
                            parent: this,
                            index: k
                        });
                    } else {
                        this[k] = value;
                    }
                });

                const xid = getRandomId();

                Object.defineProperties(this, {
                    [XDATASELF]: {
                        get: () => this
                    },
                    [PROXYTHIS]: {
                        value: proxyThis
                    },
                    [STANZID]: {
                        value: xid
                    },
                    xid: {
                        get() {
                            return xid;
                        }
                    },
                    // [WATCHHOST]: {
                    //     value: new Map()
                    // },
                    // [MODIFYIDS]: {
                    //     value: []
                    // },
                    // [SYNCSHOST]: {
                    //     value: new Map()
                    // },
                    _modifyId: {
                        value: null,
                        writable: true
                    },
                    // 当前实例数组长度
                    length: {
                        configurable: true,
                        writable: true,
                        value: length
                    }
                });
            }

            /**
             * 合并数据到实例对象
             * @param {Object} opts 设置当前数据
             */
            setData(key, value) {
                if (SET_NO_REG.test(key)) {
                    console.warn(`you can't set this key in XData => `, key);
                    return false;
                }

                if (/^_.+/.test(key)) {
                    Object.defineProperty(this, key, {
                        configurable: true,
                        writable: true,
                        value
                    })
                    return true;
                }

                let _this = this[XDATASELF];

                // 是否 point key
                if (/\./.test(key)) {
                    let kMap = key.split(".");
                    let lastId = kMap.length - 1;
                    kMap.some((k, i) => {
                        if (i == lastId) {
                            key = k;
                            return true;
                        }
                        _this = _this[k];
                    });
                    _this.setData(key, value);
                    return true;
                }

                let key_type = getType(key);
                if (key_type === "string" || key_type === "number") {
                    let oldVal = _this[key];

                    if (value === oldVal) {
                        // 一样还瞎折腾干嘛
                        return true;
                    }

                    if (oldVal instanceof XData) {
                        oldVal = oldVal.object;
                    }

                    if (value instanceof XMirror) {
                        if (value.parent) {
                            // 去除旧的依赖
                            value.remove();
                        }
                        value.parent = _this;
                        value.index = key;
                    } else if (value instanceof XData) {
                        if (value[XDATASELF]) {
                            value = value[XDATASELF];
                        }
                        if (value.parent) {
                            // 去除旧的依赖
                            value.remove();
                        }
                        value.parent = _this;
                        value.index = key;
                    } else if (value instanceof Object) {
                        // 如果是Object就转换数据
                        value = createXData(value, {
                            parent: _this,
                            index: key
                        });
                    }

                    _this[key] = value;

                    emitUpdate(_this, "setData", [key, value], {
                        oldValue: oldVal
                    });

                    return true;

                } else if (key instanceof Object) {
                    let data = key;
                    Object.keys(data).forEach(key => {
                        let value = data[key];

                        _this.setData(key, value);
                    });

                    return true;
                }
            }

            /**
             * 获取相应数据，相比直接获取，会代理得到数组类型相应的index的值
             * @param {String} keyName 获取当前实例相应 key 的数据
             */
            getData(keyName) {
                let target;
                if (keyName.includes && keyName.includes(".")) {
                    let attrNameArr = keyName.split(".");
                    target = this;
                    do {
                        let key = attrNameArr.shift();
                        target = target[key];
                    } while (attrNameArr.length)
                } else {
                    target = this[keyName]
                }

                if (target instanceof XData) {
                    target = target[PROXYTHIS];
                }

                return target;
            }

            /**
             * 删除相应Key或自身
             * @param {String|NUmber|Undefined} key 需要删除的key
             */
            remove(key) {
                if (isUndefined(key)) {
                    // 删除自身
                    let {
                        parent
                    } = this;

                    if (parent) {
                        parent.remove(this.index);
                    } else {
                        clearXData(this);
                    }
                } else {
                    let oldVal = this[key];

                    // 删除子数据
                    if (/\D/.test(key)) {
                        // 非数字
                        delete this[key];

                        clearXData(oldVal);

                        emitUpdate(this, "remove", [key]);
                    } else {
                        // 纯数字，术语数组内元素，通过splice删除
                        this.splice(parseInt(key), 1);
                    }
                }
            }

            /**
             *  深度清除当前对象，所有子对象数据也会被深度清除
             */
            deepClear() {
                // 清除非数字键
                Object.keys(this).forEach(key => {
                    if (/\D/.test(key)) {
                        let obj = this[key];

                        if (obj instanceof XData) {
                            obj.deepClear();
                        }

                        if (obj instanceof XMirror) {
                            clearXData(obj);
                        }
                    }
                });

                // 数组键内深度清除对象
                this.forEach(obj => {
                    if (obj instanceof XData) {
                        obj.deepClear();
                    }
                    if (obj instanceof XMirror) {
                        clearXData(obj);
                    }
                });

                // 清除自身
                clearXData(this);
            }

            /**
             * 从 Set 参考的方法，push的去从版
             * @param {*} value 需要添加的数据
             */
            add(value) {
                !this.includes(value) && this.push(value);
            }

            /**
             * 从 Set 参考的方法
             * @param {*} value 需要删除的数据
             */
            delete(value) {
                let tarId = this.indexOf(value);

                if (tarId > -1) {
                    this.splice(tarId, 1);
                }
            }

            /**
             * 是否包含当前值
             * 同数组方法includes，好歹has只有三个字母，用起来方便
             * @param {*} value 数组内的值
             */
            has(value) {
                return this.includes(value);
            }

            /**
             * 从 Set 参考的方法
             */
            clear() {
                this.splice(0, this.length);
            }

            /**
             * 向前插入数据
             * 当前数据必须是数组子元素
             * @param {Object} data 插入的数据
             */
            before(data) {
                if (/\D/.test(this.index)) {
                    throw {
                        text: `It must be an array element`,
                        target: this,
                        index: this.index
                    };
                }
                this.parent.splice(this.index, 0, data);
                return this;
            }

            /**
             * 向后插入数据
             * 当前数据必须是数组子元素
             * @param {Object} data 插入的数据
             */
            after(data) {
                if (/\D/.test(this.index)) {
                    throw {
                        text: `It must be an array element`,
                        target: this,
                        index: this.index
                    };
                }
                this.parent.splice(this.index + 1, 0, data);
                return this;
            }

            clone() {
                return createXData(cloneObject(this))[PROXYTHIS];
            }

            // 在emitHandler后做中间件
            emitHandler(eventName, emitData) {
                let event = transToEvent(eventName, this);

                // 过滤unBubble和update的数据
                if (event.type === "update") {
                    let {
                        _unBubble,
                        _update,
                        _unpush
                    } = this;
                    let {
                        fromKey
                    } = event.trend;
                    if (_update === false || (_unBubble && _unBubble.includes(fromKey))) {
                        event.bubble = false;
                        // return event;
                    }

                    if (_unpush && _unpush.includes(fromKey)) {
                        Object.defineProperty(event, "_unpush", {
                            value: true
                        });
                    }
                }

                XEmiter.prototype.emitHandler.call(this, event, emitData);

                return event;
            }

            // 转换为children属性机构的数据
            noStanz(opts = {
                childKey: "children"
            }) {
                return toNoStanz(this.object, opts.childKey);
            }

            /**
             * 转换为普通 object 对象
             * @property {Object} object
             */
            get object() {
                let obj = {};

                let isPureArray = true;

                let {
                    _unBubble = []
                } = this;

                // 遍历合并数组，并判断是否有非数字
                Object.keys(this).forEach(k => {
                    if (/^_/.test(k) || !/\D/.test(k) || _unBubble.includes(k) || k === "length") {
                        return;
                    }

                    let val = this[k];

                    if (val instanceof XData || val instanceof XMirror) {
                        // 禁止冒泡
                        if (val._update === false) {
                            return;
                        }

                        val = val.object;
                    }

                    obj[k] = val;

                    isPureArray = false;
                });
                this.forEach((val, k) => {
                    if (val instanceof XData || val instanceof XMirror) {
                        val = val.object;
                    }
                    obj[k] = val;
                });

                // 转换为数组格式
                if (isPureArray) {
                    obj.length = this.length;
                    obj = Array.from(obj);
                }

                return obj;
            }

            get string() {
                return JSON.stringify(this.object);
            }

            toJSON() {
                return JSON.stringify(this.object);
            }

            /**
             * 获取根节点
             * @property {XData} root
             */
            get root() {
                let root = this;
                while (root.parent) {
                    root = root.parent;
                }
                return root;
            }

            /**
             * 获取前一个相邻数据
             * @property {XData} prev
             */
            get prev() {
                if (!/\D/.test(this.index) && this.index > 0) {
                    return this.parent.getData(this.index - 1);
                }
            }

            /**
             * 获取后一个相邻数据
             * @property {XData} after
             */
            get next() {
                if (!/\D/.test(this.index)) {
                    return this.parent.getData(this.index + 1);
                }
            }

            /**
             * 获取镜像对象；
             */
            get mirror() {
                return new XMirror(this);
            }

            /**
             * 根据keys获取目标对象
             * @param {Array} keys 深度键数组
             */
            getTarget(keys) {
                let target = this;
                if (keys.length) {
                    keys.some(k => {
                        if (!target) {
                            console.warn("getTarget failure");
                            return true;
                        }
                        target = target[k];
                    });
                }
                return target;
            }

            /**
             * 监听当前对象的值
             * 若只传callback，就监听当前对象的所有变化
             * 若 keyName，则监听对象的相应 key 的值
             * @param {string} expr 监听键值
             * @param {Function} callback 相应值变动后出发的callback
             * @param {Boolean} ImmeOpt 是否立刻触发callback
             */
            watch(expr, callback, ImmeOpt) {
                // 调整参数
                let arg1Type = getType(expr);
                if (arg1Type === "object") {
                    Object.keys(expr).forEach(k => {
                        this.watch(k, expr[k], callback);
                    });
                    return;
                } else if (/function/.test(arg1Type)) {
                    ImmeOpt = callback;
                    callback = expr;
                    expr = "";
                }

                // 根据参数调整类型
                let watchType;

                if (expr === "") {
                    watchType = "watchSelf";
                } else if (expr instanceof RegExp) {
                    watchType = "watchKeyReg";
                } else if (/\./.test(expr)) {
                    watchType = "watchPointKey";
                } else {
                    watchType = "watchKey";
                }

                // let targetHostObj = this[WATCHHOST].get(expr);
                // if (!targetHostObj) {
                //     targetHostObj = new Set();
                //     this[WATCHHOST].set(expr, targetHostObj)
                // }

                let targetHostObj = getXDataProp(this, WATCHHOST).get(expr);
                if (!targetHostObj) {
                    targetHostObj = new Set();
                    getXDataProp(this, WATCHHOST).set(expr, targetHostObj)
                }

                let cacheObj = {
                    trends: [],
                    callback,
                    expr,
                    push(t) {
                        this.trends.push(t);
                    }
                };

                targetHostObj.add(cacheObj);

                let updateMethod;

                let callSelf = this[PROXYTHIS];
                switch (watchType) {
                    case "watchSelf":
                        // 监听自身
                        updateMethod = e => {
                            cacheObj.push(e.trend);

                            nextTick(() => {
                                callback.call(callSelf, {
                                    trends: Array.from(cacheObj.trends)
                                }, callSelf);

                                cacheObj.trends.length = 0;
                            }, cacheObj);
                        };

                        if (ImmeOpt === true) {
                            callback.call(callSelf, {
                                trends: []
                            }, callSelf);
                        }
                        break;
                    case "watchKey":
                    case "watchKeyReg":
                        // 监听key
                        updateMethod = e => {
                            let {
                                trend
                            } = e;
                            if ((watchType === "watchKeyReg" && expr.test(trend.fromKey)) || trend.fromKey == expr) {
                                cacheObj.push(e.trend);

                                if (!cacheObj.cacheOld) {
                                    // 获取旧值
                                    cacheObj._oldVal = e.oldValue instanceof XData ? e.oldValue.object : e.oldValue;
                                    cacheObj.cacheOld = true;
                                }

                                nextTick(() => {
                                    let val = this[expr];

                                    callback.call(callSelf, {
                                        expr,
                                        val,
                                        // old: cacheObj.trends[0].args[1],
                                        old: cacheObj._oldVal,
                                        trends: Array.from(cacheObj.trends)
                                    }, val);

                                    cacheObj.trends.length = 0;
                                    cacheObj._oldVal = cacheObj.cacheOld = false;
                                }, cacheObj);
                            }
                        };

                        if (ImmeOpt === true) {
                            callback.call(callSelf, {
                                expr,
                                val: callSelf[expr],
                                trends: []
                            }, callSelf[expr]);
                        }
                        break;
                    case "watchPointKey":
                        let pointKeyArr = expr.split(".");
                        let oldVal = this.getTarget(pointKeyArr);
                        oldVal = oldVal instanceof XData ? oldVal.object : oldVal;

                        updateMethod = e => {
                            let {
                                trend
                            } = e;

                            let trendKeys = trend.keys.slice();

                            // 补充回trend缺失的末尾key（由于setData会导致末尾Key的失去）
                            if (trendKeys.length < pointKeyArr.length) {
                                trendKeys.push(trend.finalSetterKey)
                            }

                            if (JSON.stringify(pointKeyArr) === JSON.stringify(trendKeys.slice(0, pointKeyArr.length))) {
                                let newVal;
                                try {
                                    newVal = this.getTarget(pointKeyArr);
                                } catch (e) {}
                                if (newVal !== oldVal) {
                                    cacheObj.push(trend);
                                    nextTick(() => {
                                        newVal = this.getTarget(pointKeyArr);

                                        (newVal !== oldVal) && callback.call(callSelf, {
                                            expr,
                                            old: oldVal,
                                            // val: newVal instanceof XData ? newVal[PROXYTHIS] : newVal,
                                            trends: Array.from(cacheObj.trends)
                                        }, newVal);

                                        cacheObj.trends.length = 0;
                                    }, cacheObj);
                                }
                            }
                        }

                        if (ImmeOpt === true) {
                            callback.call(callSelf, {
                                expr,
                                val: oldVal
                            }, oldVal);
                        }
                        break;
                }

                this.on("update", updateMethod);

                cacheObj.updateMethod = updateMethod;

                return this;
            }

            /**
             * 取消watch监听
             * @param {string} expr 监听值
             * @param {Function} callback 监听callback
             */
            unwatch(expr, callback) {
                // 调整参数
                let arg1Type = getType(expr);
                if (arg1Type === "object") {
                    Object.keys(expr).forEach(k => {
                        this.unwatch(k, expr[k]);
                    });
                    return this;
                } else if (/function/.test(arg1Type)) {
                    callback = expr;
                    expr = "";
                }

                let targetHostObj = getXDataProp(this, WATCHHOST).get(expr);

                if (targetHostObj) {
                    let cacheObj = Array.from(targetHostObj).find(e => e.callback === callback && e.expr === expr);

                    // 清除数据绑定
                    if (cacheObj) {
                        cacheObj.updateMethod && this.off("update", cacheObj.updateMethod);
                        targetHostObj.delete(cacheObj);
                        (!targetHostObj.size) && (getXDataProp(this, WATCHHOST).delete(expr));
                    }
                }

                return this;
            }

            /**
             * 监听表达式内容，有变化则触发callback
             * @param {String} expr 要监听的函数表达式
             * @param {Function} callback 监听后返回的数据
             */
            // watchExpr(expr, callback) {
            //     let exprHost = this[WATCHEXPRHOST] || (this[WATCHEXPRHOST] = new Map());

            //     // 根据表达式获取数组对象
            //     let targetExprHost = exprHost.get(expr);

            //     if (targetExprHost) {
            //         targetExprHost.push(callback);
            //         return;
            //     }

            //     targetExprHost = [];

            //     // 表达式生成函数
            //     const exprFun = new Function(`
            //     try{with(this){
            //         return ${expr}
            //     }}catch(err){
            //         console.error({
            //             desc:"Execution error",
            //             expr:${expr},
            //             target:this,
            //             error:err
            //         });
            //     }`).bind(this);

            //     let old_val;

            //     this.watch(e => {
            //         let reVal = exprFun();

            //         if (old_val !== reVal) {
            //             targetExprHost.forEach(func => {
            //                 func(reVal, e);
            //             })
            //             old_val = reVal;
            //         }
            //     });
            // }

            /**
             * 监听表达式为正确时就返回成功
             * @param {String} expr 监听表达式
             */
            watchUntil(expr) {
                if (/[^=]=[^=]/.test(expr)) {
                    throw 'cannot use single =';
                }
                return new Promise(resolve => {
                    let f;
                    // 忽略错误
                    let exprFun = new Function(`
            try{with(this){
                return ${expr}
            }}catch(e){}`).bind(this);
                    this.watch(f = () => {
                        let reVal = exprFun();
                        if (reVal) {
                            this.unwatch(f);
                            resolve(reVal);
                        }
                    }, true);
                });
            }

            // 6.2.2 重构seek方法，允许函数传入；字符串传入的话，则转为函数执行；
            /**
             * 深度查找子对象数据
             * @param {Function|String} expr 查找函数或函数表达式
             * @param {Boolean} seekSelf 自身是否纳入查找范围
             */
            seek(expr, seekSelf = true) {
                if (!isFunction(expr)) {
                    expr = new Function(`with(this){return ${expr}}`);
                }

                let arr = [];

                let f2 = (val) => {
                    try {
                        let bool = expr.call(val, val)

                        if (bool) {
                            arr.push(val);
                        }
                    } catch (e) {}
                }

                if (seekSelf) {
                    f2(this);
                }

                // 鉴定的方法
                let f = (val) => {
                    f2(val);

                    if (val instanceof XData) {
                        arr.push(...val.seek(expr, false));
                    }
                }

                Object.keys(this).forEach(key => {
                    if (!/\D/.test(key)) {
                        return;
                    }

                    f(this[key]);
                });

                this.forEach(val => f(val));

                // 手动回收
                f2 = f = null;

                return arr;
            }

            /**
             * 趋势数据的入口，用于同步数据
             * @param {Object} trend 趋势数据
             */
            entrend(trend) {
                let {
                    mid,
                    keys,
                    name,
                    args,
                    _unpush
                } = trend;

                if (_unpush) {
                    // 不同步的就返回
                    return;
                }

                let {
                    _unpull
                } = this;
                let fkey = getFromKey(trend);
                if (_unpull && _unpull.includes(fkey)) {
                    return;
                }

                if (!mid) {
                    throw {
                        text: "Illegal trend data"
                    };
                }

                // 获取相应目标，并运行方法
                let target = this.getTarget(keys);

                if (target) {
                    let targetSelf = target[XDATASELF];
                    if (getXDataProp(targetSelf, MODIFYIDS).includes(mid)) {
                        return false;
                    }

                    targetSelf._modifyId = mid;
                    // target._modifyId = mid;
                    targetSelf[name](...args);
                    targetSelf._modifyId = null;
                }

                return true;
            }
        }

        const getFromKey = (_this) => {
            let keyOne = _this.keys[0];

            if (isUndefined(keyOne) && (_this.name === "setData" || _this.name === "remove")) {
                keyOne = _this.args[0];
            }

            return keyOne;
        }

        /**
         * trend数据class，记录趋势数据
         * XData的每次数据变动（值变动或数组变动），都会生成趋势数据
         * @class XDataTrend
         * @constructor
         */
        class XDataTrend {
            constructor(xevent) {
                if (xevent instanceof XEvent) {
                    // 元对象数据会被修改，必须深克隆数据
                    let {
                        modify: {
                            name,
                            args,
                            mid
                        },
                        keys
                    } = cloneObject(xevent);
                    let {
                        _unpush
                    } = xevent;
                    // let { modify: { name, args, mid }, keys, _unpush } = xevent;

                    if (_unpush) {
                        Object.defineProperty(this, "_unpush", {
                            value: true
                        });
                    }

                    Object.assign(this, {
                        name,
                        args,
                        mid,
                        keys
                    });

                } else {
                    Object.assign(this, xevent);
                }
            }

            /**
             * 转换后的字符串
             */
            get string() {
                return JSON.stringify(this);
            }

            get finalSetterKey() {
                switch (this.name) {
                    case "remove":
                    case "setData":
                        return this.args[0];
                }
            }

            get fromKey() {
                return getFromKey(this);

                // let keyOne = this.keys[0];

                // if (isUndefined(keyOne) && (this.name === "setData" || this.name === "remove")) {
                //     keyOne = this.args[0];
                // }

                // return keyOne;
            }

            set fromKey(keyName) {
                let keyOne = this.keys[0];

                if (!isUndefined(keyOne)) {
                    this.keys[0] = keyName;
                } else if (this.name === "setData" || this.name === "remove") {
                    this.args[0] = keyName;
                }
            }
        }

        /**
         * XData的镜像对象
         * 镜像对象跟xdata公用一份，不会复制双份数据；
         * 可嵌入到其他对象内而不影响使用
         */
        // class XMirror extends XEmiter {
        class XMirror {
            constructor(xdata) {
                // super({});

                this[XMIRROR_SELF] = this;
                this.mirrorHost = xdata;
                this.parent = undefined;
                this.index = undefined;

                let updateFunc = (e) => {
                    if (this.parent) {
                        emitUpdate(this.parent, "", [], {}, (e2) => {
                            Object.assign(e2, {
                                keys: cloneObject(e.keys),
                                modify: cloneObject(e.modify),
                                currentTarget: e.currentTarget,
                                target: e.target,
                                oldValue: e.oldValue
                            });
                            e2.keys.unshift(this.index);
                        });
                    }
                }
                xdata.on("update", updateFunc);

                this[XMIRRIR_UPDATA_BINDER] = updateFunc;

                return new Proxy(this, XMirrorHandler);
            }

            remove(key) {
                return XData.prototype.remove.call(this, key);
            }
        }

        // XMirror实例的
        const XMIRRIR_UPDATA_BINDER = Symbol("XMirrorUpdataBinder");
        const XMIRROR_SELF = Symbol("XMirror_self");
        // const XMIRROR_SELF = "XMIRROR_SELF";

        // 可访问自身的key
        const XMIRRIR_CANSET_KEYS = new Set(["index", "parent", "remove", XMIRRIR_UPDATA_BINDER, XMIRROR_SELF]);

        // 绑定行为的方法名，在清除时同步清除绑定的方法
        // const XMIRRIR_RECORD_NAME = new Set(["on", "watch"]);

        const XMirrorHandler = {
            get(target, key, receiver) {
                if (XMIRRIR_CANSET_KEYS.has(key)) {
                    return target[key];
                }
                let r_val;
                if (typeof key === "symbol") {
                    r_val = target.mirrorHost[key];
                } else {
                    r_val = target.mirrorHost.getData(key);
                }

                if (isFunction(r_val)) {
                    r_val = r_val.bind(target.mirrorHost[PROXYTHIS]);
                }

                return r_val;
            },
            set(target, key, value, receiver) {
                if (XMIRRIR_CANSET_KEYS.has(key)) {
                    target[key] = value;
                    return true;
                }
                return target.mirrorHost.setData(key, value);
            }
        };

        /**
         * 根据key值同步数据
         * @param {String} key 要同步的key
         * @param {Trend} e 趋势数据
         * @param {XData} xdata 同步覆盖的数据对象
         */
        const pubSyncByKey = (key, e, xdata) => {
            e.trends.forEach(trend => {
                if (trend.fromKey === key) {
                    xdata.entrend(trend);
                }
            });
        }

        /**
         * 根据key数组同步数据
         * @param {String} keyArr 要同步的key数组
         * @param {Trend} e 趋势数据
         * @param {XData} xdata 同步覆盖的数据对象
         */
        const pubSyncByArray = (keyArr, e, xdata) => {
            e.trends.forEach(trend => {
                if (keyArr.includes(trend.fromKey)) {
                    xdata.entrend(trend);
                }
            });
        }

        /**
         * 根据映射对象同步数据
         * @param {Map} optMap key映射对象
         * @param {Trend} e 趋势数据
         * @param {XData} xdata 同步覆盖的数据对象
         */
        const pubSyncByObject = (optMap, e, xdata) => {
            let cloneTrends = cloneObject(e.trends);
            cloneTrends.forEach(trend => {
                trend = new XDataTrend(trend);
                let {
                    fromKey
                } = trend;
                // 修正key值
                if (!isUndefined(fromKey)) {
                    let mKey = optMap.get(fromKey)
                    if (mKey) {
                        trend.fromKey = mKey;
                        xdata.entrend(trend);
                    }
                }
            });
        }

        /**
         * 转换可以直接设置在XData上的值
         * @param {*} value 如果是XData，转换为普通对象数据
         */
        const getNewSyncValue = (value) => {
            (value instanceof XData) && (value = value.object);
            return value;
        };

        // const virDataTrans = (self, target, callback) => {
        //     Object.keys(self).forEach(key => {
        //         let val = self[key];

        //         if (val instanceof Object) {
        //             if (!target[key]) {
        //                 if (target.setData) {
        //                     target.setData(key, {})
        //                 } else {
        //                     target[key] = {};
        //                 }
        //             }

        //             let vdata = target[key];

        //             virDataTrans(val, vdata, callback);
        //         } else {
        //             let keyValue = callback([key, val], {
        //                 self, target
        //             });
        //             if (keyValue) {
        //                 let [newKey, newValue] = keyValue;
        //                 target[newKey] = newValue;
        //             }
        //         }
        //     });
        // }

        // const entrendByCall = (target, e, callback) => {
        //     let { trend } = e;
        //     if (trend) {
        //         switch (trend.name) {
        //             case "setData":
        //                 let value = trend.args[1];
        //                 if (value instanceof Object) {
        //                     let obj = {};
        //                     virDataTrans(value, obj, callback);
        //                     trend.args[1] = obj;
        //                 } else if (!isUndefined(value)) {
        //                     trend.args = callback(trend.args, {
        //                         event: e
        //                     });
        //                 }
        //                 break;
        //             default:
        //                 // 其他数组的话，修正参数
        //                 trend.args = trend.args.map(value => {
        //                     let nVal = value;
        //                     if (value instanceof Object) {
        //                         nVal = {};
        //                         virDataTrans(value, nVal, callback);
        //                     }
        //                     return nVal;
        //                 });
        //                 break;
        //         }
        //         target.entrend(trend);
        //     }
        // }

        const SyncMethods = {
            /**
             * 同步数据
             * @param {XData} xdata 需要同步的数据
             */
            sync(xdata, opts, isCoverRight) {
                let optsType = getType(opts);

                let leftFun, rightFun;

                switch (optsType) {
                    case "string":
                        if (isCoverRight) {
                            xdata.setData(opts, getNewSyncValue(this[opts]));
                        }

                        leftFun = e => pubSyncByKey(opts, e, xdata)
                        rightFun = e => pubSyncByKey(opts, e, this)
                        break;
                    case "array":
                        if (isCoverRight) {
                            opts.forEach(key => {
                                xdata.setData(key, getNewSyncValue(this[key]));
                            });
                        }

                        leftFun = e => pubSyncByArray(opts, e, xdata)
                        rightFun = e => pubSyncByArray(opts, e, this)
                        break;
                    case "object":
                        let optMap = new Map(Object.entries(opts));
                        let resOptsMap = new Map(Object.entries(opts).map(arr => arr.reverse()));

                        if (isCoverRight) {
                            Object.keys(opts).forEach(key => {
                                xdata.setData(opts[key], getNewSyncValue(this[key]));
                            });
                        }

                        leftFun = e => pubSyncByObject(optMap, e, xdata)
                        rightFun = e => pubSyncByObject(resOptsMap, e, this)
                        break
                    default:
                        if (isCoverRight) {
                            let obj = this.object;

                            Object.keys(obj).forEach(k => {
                                xdata.setData(k, obj[k]);
                            });
                        }

                        leftFun = e => e.trends.forEach(trend => xdata.entrend(trend))
                        rightFun = e => e.trends.forEach(trend => this.entrend(trend))
                        break;
                }

                this.watch(leftFun);
                xdata.watch(rightFun);

                let sHost = getXDataProp(this, SYNCSHOST);

                // 把之前的绑定操作清除
                if (sHost.has(xdata)) {
                    this.unsync(xdata);
                }

                // 记录信息
                sHost.set(xdata, {
                    selfWatch: leftFun,
                    oppWatch: rightFun
                });
                getXDataProp(xdata, SYNCSHOST).set(this, {
                    selfWatch: rightFun,
                    oppWatch: leftFun
                });
            },
            /**
             * 取消同步数据
             * @param {XData} xdata 需要取消同步的数据
             */
            unsync(xdata) {
                let syncData = getXDataProp(this, SYNCSHOST).get(xdata);

                if (syncData) {
                    let {
                        selfWatch,
                        oppWatch
                    } = syncData;
                    this.unwatch(selfWatch);
                    xdata.unwatch(oppWatch);
                    getXDataProp(this, SYNCSHOST).delete(xdata);
                    getXDataProp(xdata, SYNCSHOST).delete(this);
                }
            },
            /**
             * 生成虚拟数据
             */
            // virData(leftCall, rightCall) {
            //     // 初始生成数据
            //     let vdata = new VirData(this[XDATASELF], {});
            //     let arg1Type = getType(leftCall);
            //     let mapOpts = leftCall;

            //     if (arg1Type == "object") {
            //         if ("mapKey" in mapOpts) {
            //             let mappingOpt = Object.entries(mapOpts.mapKey);
            //             let mapping = new Map(mappingOpt);
            //             let resMapping = new Map(mappingOpt.map(e => e.reverse()));

            //             leftCall = ([key, value]) => {
            //                 if (mapping.has(key)) {
            //                     return [mapping.get(key), value];
            //                 }
            //                 return [key, value];
            //             }
            //             rightCall = ([key, value]) => {
            //                 if (resMapping.has(key)) {
            //                     return [resMapping.get(key), value];
            //                 }
            //                 return [key, value];
            //             }
            //         } else if ("mapValue" in mapOpts) {
            //             let tarKey = mapOpts.key;
            //             let mappingOpt = Object.entries(mapOpts.mapValue);
            //             let mapping = new Map(mappingOpt);
            //             let resMapping = new Map(mappingOpt.map(e => e.reverse()));

            //             leftCall = ([key, value]) => {
            //                 if (key === tarKey && mapping.has(value)) {
            //                     return [key, mapping.get(value)];
            //                 }
            //                 return [key, value];
            //             }
            //             rightCall = ([key, value]) => {
            //                 if (key === tarKey && resMapping.has(value)) {
            //                     return [key, resMapping.get(value)];
            //                 }
            //                 return [key, value];
            //             }
            //         }
            //     }
            //     // 转换数据
            //     virDataTrans(this, vdata, leftCall);

            //     let leftUpdate, rightUpdate;

            //     this.on("update", leftUpdate = e => entrendByCall(vdata, e, leftCall));
            //     vdata.on("update", rightUpdate = e => entrendByCall(this, e, rightCall));

            //     // 记录信息
            //     getXDataProp(this, VIRDATAHOST).push({
            //         data: vdata,
            //         leftUpdate, rightUpdate
            //     });

            //     return vdata[PROXYTHIS];
            // }
        };

        Object.keys(SyncMethods).forEach(methodName => {
            Object.defineProperty(XData.prototype, methodName, {
                writable: true,
                value: SyncMethods[methodName]
            });
        });

        // class VirData extends XData {
        //     constructor(xdata, ...args) {
        //         super(...args);
        //         Object.defineProperty(this, "mappingXData", {
        //             writable: true,
        //             value: xdata
        //         });
        //     }
        // }

        // 重构Array的所有方法

        // 不影响数据原结构的方法，重新做钩子
        ['concat', 'every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'slice', 'some', 'indexOf', 'lastIndexOf', 'includes', 'join'].forEach(methodName => {
            let arrayFnFunc = Array.prototype[methodName];
            if (arrayFnFunc) {
                Object.defineProperty(XData.prototype, methodName, {
                    value(...args) {
                        return arrayFnFunc.apply(this, args);
                    }
                });
            }
        });

        // 触发updateIndex事件
        const emitXDataIndex = (e, index, oldIndex) => {
            if ((e instanceof XData || e instanceof XMirror) && index !== oldIndex) {
                e.index = index;
                e.emitHandler("updateIndex", {
                    oldIndex,
                    index
                });
            }
        }

        // 几个会改变数据结构的方法
        ['pop', 'push', 'reverse', 'splice', 'shift', 'unshift'].forEach(methodName => {
            // 原来的数组方法
            let arrayFnFunc = Array.prototype[methodName];

            if (arrayFnFunc) {
                Object.defineProperty(XData.prototype, methodName, {
                    value(...args) {
                        // 重构新参数
                        let newArgs = [];

                        let _this = this[XDATASELF];

                        let oldValue = _this.object;

                        args.forEach(val => {
                            if (val instanceof XData) {
                                let xSelf = val[XDATASELF];
                                xSelf.remove();
                                newArgs.push(xSelf);
                            } else if (val instanceof XMirror) {
                                val.parent = _this;
                                newArgs.push(val);
                            } else {
                                // 转化内部数据
                                let newVal = createXData(val, {
                                    parent: _this
                                });
                                newArgs.push(newVal);
                            }
                        });

                        // pop shift splice 的返回值，都是被删除的数据，内部数据清空并回收
                        let returnVal = arrayFnFunc.apply(_this, newArgs);

                        // 重置index
                        _this.forEach((e, i) => {
                            let oldIndex = e.index;
                            emitXDataIndex(e, i, oldIndex);
                        });

                        // 删除returnVal的相关数据
                        switch (methodName) {
                            case "shift":
                            case "pop":
                                if (returnVal instanceof XData || returnVal instanceof XMirror) {
                                    clearXData(returnVal);
                                }
                                break;
                            case "splice":
                                returnVal.forEach(e => {
                                    if (e instanceof XData || e instanceof XMirror) {
                                        clearXData(e);
                                    }
                                });
                        }

                        emitUpdate(_this, methodName, args, {
                            oldValue
                        });

                        return returnVal;
                    }
                });
            }
        });

        Object.defineProperties(XData.prototype, {
            sort: {
                value(arg) {
                    let args = [];
                    let _this = this[XDATASELF];
                    let oldValue = _this.object;
                    let oldThis = Array.from(_this);
                    if (isFunction(arg) || !arg) {
                        Array.prototype.sort.call(_this, arg);

                        // 重置index
                        // 记录重新调整的顺序
                        _this.forEach((e, i) => {
                            let oldIndex = e.index;
                            emitXDataIndex(e, i, oldIndex);
                        });
                        let orders = oldThis.map(e => e.index);
                        args = [orders];
                        oldThis = null;
                    } else if (arg instanceof Array) {
                        arg.forEach((aid, id) => {
                            let tarData = _this[aid] = oldThis[id];
                            let oldIndex = tarData.index;
                            emitXDataIndex(tarData, aid, oldIndex);
                        });
                        args = [arg];
                    }

                    emitUpdate(_this, "sort", args, {
                        oldValue
                    });

                    return this;
                }
            }
        });
        // business function
        // 判断元素是否符合条件
        const meetsEle = (ele, expr) => {
            if (!ele.tagName) {
                return false;
            }
            if (ele === expr) {
                return true;
            }
            if (ele === document) {
                return false;
            }
            let tempEle = document.createElement('template');
            let html = `<${ele.tagName.toLowerCase()} ${Array.from(ele.attributes).map(e => e.name + '="' + e.value + '"').join(" ")} />`

            tempEle.innerHTML = html;
            return !!tempEle.content.querySelector(expr);
        }

        // 转换元素
        const parseStringToDom = (str) => {
            let par = document.createElement('div');
            par.innerHTML = str;
            let childs = Array.from(par.childNodes);
            return childs.filter(function(e) {
                if (!(e instanceof Text) || (e.textContent && e.textContent.trim())) {
                    par.removeChild(e);
                    return e;
                }
            });
        };

        const parseDataToDom = (objData) => {
            if (!objData.tag) {
                console.error("this data need tag =>", objData);
                throw "";
            }

            // 生成element
            let ele = document.createElement(objData.tag);

            // 添加数据
            objData.class && ele.setAttribute('class', objData.class);
            objData.slot && ele.setAttribute('slot', objData.slot);
            objData.text && (ele.textContent = objData.text);
            let {
                data
            } = objData;
            data && Object.keys(data).forEach(k => {
                let val = data[k];
                ele.dataset[k] = val;
            });

            if (ele.xvele) {
                let xhearele = createXhearEle(ele);

                xhearele[CANSETKEYS].forEach(k => {
                    let val = objData[k];
                    if (!isUndefined(val)) {
                        xhearele[k] = val;
                    }
                });
            }

            // 填充子元素
            let akey = 0;
            while (akey in objData) {
                // 转换数据
                let childEle = parseDataToDom(objData[akey]);
                ele.appendChild(childEle);
                akey++;
            }

            return ele;
        }

        const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

        const parseToDom = (expr) => {
            let ele;

            if (expr instanceof XhearEle) {
                return expr.ele;
            }

            switch (getType(expr)) {
                case "string":
                    if (/\<.+\>/.test(expr)) {
                        ele = parseStringToDom(expr);
                        ele = ele[0];
                    }
                    break;
                case "object":
                    ele = parseDataToDom(expr);
                    break;
                default:
                    if (expr instanceof Element || expr instanceof DocumentFragment || expr instanceof Document) {
                        ele = expr;
                    }
            }
            return ele;
        }

        /**
         * 查找元素内相匹配的元素，并以数组形式返回
         * @param {Element} target 目标节点
         * @param {String} expr 表达字符串
         */
        const queAllToArray = (target, expr) => {
            let tars = target.querySelectorAll(expr);
            return tars ? Array.from(tars) : [];
        }

        const isXhear = (target) => target instanceof XhearEle;

        // 将 element attribute 横杠转换为大小写模式
        const attrToProp = key => {
            // 判断是否有横线
            if (/\-/.test(key)) {
                key = key.replace(/\-[\D]/g, (letter) => letter.substr(1).toUpperCase());
            }
            return key;
        }
        const propToAttr = key => {
            if (/[A-Z]/.test(key)) {
                key = key.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase());
            }
            return key;
        }

        // 设置属性
        const attrsHandler = {
            get: function(target, prop) {
                return target._ele.getAttribute(propToAttr(prop));
            },
            set: function(target, prop, value) {
                if (value === null) {
                    target._ele.removeAttribute(propToAttr(prop));
                } else {
                    target._ele.setAttribute(propToAttr(prop), String(value));
                }

                return true;
            }
        };

        /**
         * 元素 attributes 代理对象
         */
        class Attrs {
            constructor(ele) {
                Object.defineProperties(this, {
                    _ele: {
                        get: () => ele
                    }
                });
            }
        }

        /**
         * 生成代理attrs对象
         * @param {HTMLElement} ele 目标html元素
         */
        const createProxyAttrs = (ele) => {
            let proxyAttrs = ele.__p_attrs;

            if (!proxyAttrs) {
                ele.__p_attrs = proxyAttrs = new Proxy(new Attrs(ele), attrsHandler);
            }

            return proxyAttrs;
        }

        const extend = (_this, proto) => {
            Object.keys(proto).forEach(k => {
                // 获取描述
                let {
                    get,
                    set,
                    value
                } = getOwnPropertyDescriptor(proto, k);

                if (value) {
                    if (_this.hasOwnProperty(k)) {
                        _this[k] = value;
                    } else {
                        Object.defineProperty(_this, k, {
                            value
                        });
                    }
                } else {
                    // debugger
                    // get && (get = get.bind(_this))

                    Object.defineProperty(_this, k, {
                        get,
                        set
                    });

                    if (set) {
                        // 添加到可设置key权限内
                        xEleDefaultSetKeys.add(k);
                    }
                }
            });
        }
        // 可setData的key
        const CANSETKEYS = Symbol("cansetkeys");
        const ORIEVE = Symbol("orignEvents");

        // 可直接设置的Key
        const xEleDefaultSetKeys = new Set(["text", "html", "display", "style"]);

        // 可直接设置的Key并且能冒泡（在普通元素下，非组件）
        // const xEleDefaultSetKeysCanUpdate = new Set(["text", "html"]);

        // 不可设置的key
        // const UnSetKeys = new Set(["parent", "index", "slot"]);
        const UnSetKeys = new Set(["parent", "slot"]);

        const XDataSetData = XData.prototype.setData;

        class XhearEle extends XData {
            constructor(ele) {
                super({});
                delete this.parent;
                delete this.index;
                delete this.length;
                Object.defineProperties(ele, {
                    __xhear__: {
                        value: this,
                        configurable: true
                    }
                });
                let tagValue = ele.tagName ? ele.tagName.toLowerCase() : '';
                Object.defineProperties(this, {
                    tag: {
                        enumerable: true,
                        value: tagValue
                    },
                    ele: {
                        value: ele
                    },
                    [ORIEVE]: {
                        writable: true,
                        // value: new Map()
                        value: ""
                    }
                    // [CANSETKEYS]: {
                    //     value: new Set([])
                    // }
                });
            }

            get parent() {
                let {
                    parentNode
                } = this.ele;
                // if (parentNode instanceof DocumentFragment) {
                //     return;
                // }
                return (!parentNode || parentNode === document) ? null : createXhearProxy(parentNode);
            }

            get index() {
                let {
                    ele
                } = this;
                return Array.from(ele.parentNode.children).indexOf(ele);
            }

            get length() {
                return this.ele.children.length;
            }

            get class() {
                return this.ele.classList;
            }

            get data() {
                return this.ele.dataset;
            }

            get css() {
                return getComputedStyle(this.ele);
            }

            get position() {
                return {
                    top: this.ele.offsetTop,
                    left: this.ele.offsetLeft
                };
            }

            get offset() {
                let reobj = {
                    top: 0,
                    left: 0
                };

                let tar = this.ele;
                while (tar && tar !== document) {
                    reobj.top += tar.offsetTop;
                    reobj.left += tar.offsetLeft;
                    tar = tar.offsetParent
                }
                return reobj;
            }

            get width() {
                return parseInt(getComputedStyle(this.ele).width);
            }

            get height() {
                return parseInt(getComputedStyle(this.ele).height);
            }

            get innerWidth() {
                return this.ele.clientWidth;
            }

            get innerHeight() {
                return this.ele.clientHeight;
            }

            get offsetWidth() {
                return this.ele.offsetWidth;
            }

            get offsetHeight() {
                return this.ele.offsetHeight;
            }

            get outerWidth() {
                let computedStyle = getComputedStyle(this.ele);
                return this.ele.offsetWidth + parseInt(computedStyle['margin-left']) + parseInt(computedStyle['margin-right']);
            }

            get outerHeight() {
                let computedStyle = getComputedStyle(this.ele);
                return this.ele.offsetHeight + parseInt(computedStyle['margin-top']) + parseInt(computedStyle['margin-bottom']);
            }

            get text() {
                return this.ele.textContent;
            }

            set text(val) {
                this.ele.textContent = val;
            }

            get html() {
                return this.ele.innerHTML;
            }

            set html(val) {
                this.ele.innerHTML = val;
            }

            get display() {
                return getComputedStyle(this.ele)['display'];
            }

            set display(val) {
                this.ele.style['display'] = val;
            }

            get style() {
                return this.ele.style;
            }

            set style(d) {
                if (getType(d) == "string") {
                    this.ele.style = d;
                    return;
                }

                let {
                    style
                } = this;

                // 覆盖旧的样式
                let hasKeys = Array.from(style);
                let nextKeys = Object.keys(d);

                // 清空不用设置的key
                hasKeys.forEach(k => {
                    if (!nextKeys.includes(k)) {
                        style[k] = "";
                    }
                });

                Object.assign(style, d);
            }

            get $shadow() {
                let {
                    shadowRoot
                } = this.ele;
                return shadowRoot && createXhearProxy(shadowRoot);
            }

            get $root() {
                let root = this.ele;
                while (root.parentNode) {
                    root = root.parentNode;
                }
                return root && createXhearProxy(root);
            }

            get $host() {
                let {
                    $root
                } = this;
                return $root && $root.ele.host && createXhearProxy($root.ele.host);
            }

            get attrs() {
                return createProxyAttrs(this.ele);
            }

            // 监听指定元素的变动
            moni(queStr, func) {
                let olds;
                this.watch(() => {
                    let eles = this.all(queStr);
                    let isSame = true;

                    // 确保数据一致
                    if (olds && olds.length == eles.length) {
                        eles.some(e => {
                            if (!olds.includes(e)) {
                                isSame = false;
                                return true;
                            }
                        });
                    } else {
                        isSame = false;
                    }

                    if (isSame) {
                        return;
                    }

                    let obj = {
                        old: olds,
                        val: eles
                    };

                    olds = eles;

                    func(eles, obj);
                }, true);
            }


            setData(key, value) {
                if (UnSetKeys.has(key)) {
                    console.warn(`can't set this key => `, key);
                    return false;
                }

                key = attrToProp(key);

                let _this = this[XDATASELF];

                // 只有在允许列表里才能进行set操作
                let canSetKey = this[CANSETKEYS];
                if (xEleDefaultSetKeys.has(key)) {

                    let descriptor = getOwnPropertyDescriptor(_this, key);

                    if (!descriptor || !descriptor.set) {
                        // 直接设置
                        _this[key] = value;
                    } else {
                        descriptor.set.call(this[PROXYTHIS], value);
                    }

                    // if (xEleDefaultSetKeysCanUpdate.has(key)) {
                    //     emitUpdate(_this, "setData", [key, value], {
                    //         oldValue: oldVal
                    //     });
                    // }
                    return true;
                } else if ((canSetKey && canSetKey.has(key)) || /^_.+/.test(key)) {
                    // 直接走xdata的逻辑
                    return XDataSetData.call(_this, key, value);
                } else if (!/\D/.test(key)) {
                    let xele = $(value);

                    let targetChild = _this.ele.children[key];

                    // 这里还欠缺冒泡机制的
                    if (targetChild) {
                        let oldVal = _this.getData(key).object;

                        _this.ele.insertBefore(xele.ele, targetChild);
                        _this.ele.removeChild(targetChild);

                        // 冒泡设置
                        emitUpdate(_this, "setData", [key, value], {
                            oldValue: oldVal
                        });
                    } else {
                        _this.ele.appendChild(xele.ele);

                        // 冒泡设置
                        emitUpdate(_this, "setData", [key, value], {
                            oldValue: undefined
                        });
                    }
                }

                return true;
            }

            getData(key) {
                key = attrToProp(key);

                let _this = this[XDATASELF];

                let target;

                if (!/\D/.test(key)) {
                    // 纯数字，直接获取children
                    target = _this.ele.children[key];
                    target && (target = createXhearProxy(target));
                } else {
                    let descriptor = getOwnPropertyDescriptor(_this, key);

                    if (!descriptor) {
                        target = _this[key];
                    } else {
                        let {
                            get,
                            value
                        } = descriptor;
                        if (!isUndefined(value)) {
                            target = value;
                        } else if (get) {
                            target = get.call(this[PROXYTHIS], key);
                        }
                    }

                    // target = _this[key];
                }

                if (target instanceof XData) {
                    target = target[PROXYTHIS];
                }

                return target;
            }

            siblings(expr) {
                // 获取相邻元素
                let parChilds = Array.from(this.parent.ele.children);

                // 删除自身
                let tarId = parChilds.indexOf(this.ele);
                parChilds.splice(tarId, 1);

                // 删除不符合规定的
                if (expr) {
                    parChilds = parChilds.filter(e => {
                        if (meetsEle(e, expr)) {
                            return true;
                        }
                    });
                }

                return parChilds.map(e => createXhearProxy(e));
            }

            empty() {
                this.splice(0, this.length);
                return this;
            }

            parents(expr, until) {
                let pars = [];
                let tempTar = this.parent;

                if (!expr) {
                    while (tempTar) {
                        pars.push(tempTar);
                        tempTar = tempTar.parent;
                    }
                } else {
                    if (getType(expr) == "string") {
                        while (tempTar && tempTar) {
                            if (meetsEle(tempTar.ele, expr)) {
                                pars.push(tempTar);
                            }
                            tempTar = tempTar.parent;
                        }
                    }
                }

                if (until) {
                    if (until instanceof XhearEle) {
                        let newPars = [];
                        pars.some(e => {
                            if (e === until) {
                                return true;
                            }
                            newPars.push(e);
                        });
                        pars = newPars;
                    } else if (getType(until) == "string") {
                        let newPars = [];
                        pars.some(e => {
                            if (e.is(until)) {
                                return true;
                            }
                            newPars.push(e);
                        });
                        pars = newPars;
                    }
                }

                return pars;
            }

            is(expr) {
                return meetsEle(this.ele, expr)
            }

            $(expr) {
                let tar = this.ele.querySelector(expr);
                if (tar) {
                    return createXhearProxy(tar);
                }
            }

            all(expr) {
                return queAllToArray(this.ele, expr).map(tar => createXhearProxy(tar));
            }

            clone() {
                let cloneEle = createXhearProxy(this.ele.cloneNode(true));

                // 数据重新设置
                Object.keys(this).forEach(key => {
                    if (key !== "tag") {
                        cloneEle[key] = this[key];
                    }
                });

                return cloneEle;
            }

            // extend(proto) {
            //     Object.keys(proto).forEach(k => {
            //         // 获取描述
            //         let {
            //             get,
            //             set,
            //             value
            //         } = getOwnPropertyDescriptor(proto, k);

            //         if (value) {
            //             if (this.hasOwnProperty(k)) {
            //                 this[k] = value;
            //             } else {
            //                 Object.defineProperty(this, k, {
            //                     value
            //                 });
            //             }
            //         } else {
            //             // debugger
            //             // get && (get = get.bind(this))

            //             Object.defineProperty(this, k, {
            //                 get,
            //                 set
            //             });

            //             if (set) {
            //                 // 添加到可设置key权限内
            //                 xEleDefaultSetKeys.add(k);
            //             }
            //         }
            //     });
            //     return this;
            // }

            // getTarget(keys) {
            //     let target = this;
            //     if (keys.length) {
            //         keys.some(k => {
            //             if (!target) {
            //                 console.warn("getTarget failure");
            //                 return true;
            //             }
            //             target = target[k];

            //             if (target._fakeWrapper) {
            //                 target = target._fakeWrapper;
            //                 // debugger
            //             }
            //         });
            //     }
            //     return target;
            // }
        }

        const XhearEleFn = XhearEle.prototype;

        const MOUSEEVENT = glo.MouseEvent || Event;
        const TOUCHEVENT = glo.TouchEvent || Event;
        // 修正 Event Class 用的数据表
        const EventMap = new Map([
            ["click", MOUSEEVENT],
            ["mousedown", MOUSEEVENT],
            ["mouseup", MOUSEEVENT],
            ["mousemove", MOUSEEVENT],
            ["mouseenter", MOUSEEVENT],
            ["mouseleave", MOUSEEVENT],
            ["touchstart", TOUCHEVENT],
            ["touchend", TOUCHEVENT],
            ["touchmove", TOUCHEVENT]
        ]);

        // 分析事件参数
        const anlyEveOpts = (args) => {
            let eventName = args[0],
                selector,
                callback,
                data;

            // 判断是否对象传入
            if (getType(eventName) == "object") {
                let eveOnObj = eventName;
                eventName = eveOnObj.event;
                callback = eveOnObj.callback;
                data = eveOnObj.data;
                selector = eveOnObj.selector;
            } else {
                // 判断第二个参数是否字符串，字符串当做selector处理
                switch (getType(args[1])) {
                    case "string":
                        selector = args[1];
                        callback = args[2];
                        data = args[3];
                        break;
                    default:
                        callback = args[1];
                        data = args[2];
                }
            }

            return {
                eventName,
                selector,
                callback,
                data
            };
        }

        // 绑定事件on方法抽离
        function onEve(args, onOpts = {
            count: Infinity
        }) {
            let {
                eventName,
                selector,
                callback,
                data
            } = anlyEveOpts(args);

            let originEve = this[ORIEVE] || (this[ORIEVE] = new Map());

            if (!originEve.has(eventName)) {
                let eventCall = (e) => {
                    let {
                        _para_x_eve_
                    } = e;

                    let event;
                    if (_para_x_eve_) {
                        event = _para_x_eve_;

                        // 当target不一致时，修正target
                        if (event.target.ele !== e.target) {
                            event.target = createXhearProxy(e.target);
                        }

                        let newKeys = [];

                        let tarEle = e.target;
                        while (tarEle !== e.currentTarget) {
                            let par = tarEle.parentNode;
                            if (!par) {
                                break;
                            }
                            let tarId = Array.from(par.children).indexOf(tarEle);
                            newKeys.unshift(tarId);
                            tarEle = par;
                        }

                        // 重新修正keys
                        event.keys = newKeys;
                    } else {
                        event = new XEvent({
                            type: eventName,
                            target: createXhearProxy(e.target)
                        });

                        // 事件方法转移
                        event.on("set-bubble", (e2, val) => !val && e.stopPropagation());
                        event.on("set-cancel", (e2, val) => val && e.stopImmediatePropagation());
                        event.preventDefault = e.preventDefault.bind(e);

                        e._para_x_eve_ = event;
                    }

                    // 设置原始事件对象
                    event.originalEvent = e;

                    // 触发事件
                    this.emitHandler(event);

                    // 清空原始事件
                    event.originalEvent = null;

                    // 次数修正
                    // 计数递减
                    onOpts.count--;
                    if (!onOpts.count) {
                        this.off(eventName, callback);
                    }
                }
                originEve.set(eventName, eventCall);
                this.ele.addEventListener(eventName, eventCall);
            }

            this.addListener({
                type: eventName,
                count: onOpts.count,
                data,
                callback
            });

            if (selector) {
                // 获取事件寄宿对象
                let eves = getEventsArr(eventName, this);

                eves.forEach(e => {
                    if (e.callback == callback) {
                        e.before = (opts) => {
                            let {
                                self,
                                event
                            } = opts;
                            let target = event.target;

                            // 目标元素
                            let delegateTarget;
                            if (target.is(selector)) {
                                delegateTarget = target;
                            } else {
                                delegateTarget = target.parents(selector)[0];
                            }

                            // 判断是否在selector内
                            if (!delegateTarget) {
                                return 0;
                            }

                            // 通过selector验证
                            // 设置两个关键数据
                            Object.assign(event, {
                                selector,
                                delegateTarget
                            });

                            // 返回可运行
                            return 1;
                        }
                        e.after = (opts) => {
                            let {
                                self,
                                event
                            } = opts;

                            // 删除无关数据
                            delete event.selector;
                            delete event.delegateTarget;
                        }
                    }
                });
            }
        }

        extend(XhearEleFn, {
            on(...args) {
                onEve.call(this, args);
                return this;
            },
            off(...args) {
                let eventName = args[0];

                // 获取事件寄宿对象
                let eves = getEventsArr(eventName, this);

                // 继承旧方法
                XData.prototype.off.apply(this, args);

                if (!eves.length) {
                    let originEve = this[ORIEVE] || (this[ORIEVE] = new Map());

                    // 原生函数注册也干掉
                    let oriFun = originEve.get(eventName);
                    oriFun && this.ele.removeEventListener(eventName, oriFun);
                    originEve.delete(eventName);
                }
                return this;
            },
            one(...args) {
                onEve.call(this, args, {
                    count: 1
                });
                return this;
            },
            trigger(type, opts) {
                let event;

                let defaults = {
                    bubbles: true,
                    cancelable: true
                };

                Object.assign(defaults, opts);

                if (type instanceof Event) {
                    event = type;
                } else {
                    let E = EventMap.get(type) || Event;
                    event = new E(type, {
                        bubbles: defaults.bubbles,
                        cancelable: defaults.cancelable
                    });
                }

                // 触发事件
                this.ele.dispatchEvent(event);

                return this;
            }
        });
        // 不影响数据原结构的方法，重新做钩子
        ['concat', 'every', 'filter', 'find', 'findIndex', 'forEach', 'map', 'slice', 'some', 'indexOf', 'lastIndexOf', 'includes', 'join'].forEach(methodName => {
            let arrayFnFunc = Array.prototype[methodName];
            if (arrayFnFunc) {
                Object.defineProperty(XhearEleFn, methodName, {
                    value(...args) {
                        return arrayFnFunc.apply(Array.from(this.ele.children).map(e => createXhearProxy(e)), args);
                    }
                });
            }
        });

        /**
         * 触发子元素的index事件
         * @param {Object} _this 目标元素
         * @param {Array} oldArr 旧的子元素数组
         */
        const emitChildsXDataIndex = (_this, oldArr) => {
            _this.forEach((e, index) => {
                let oldIndex = oldArr.findIndex(e2 => e2 === e);
                if (oldIndex !== -1 && oldIndex !== index) {
                    emitXDataIndex(e, index, oldIndex);
                }
            });
        }

        /**
         * 模拟array splice方法
         * @param {XhearEle} t 目标对象
         * @param {Number} index splice index
         * @param {Number} howmany splice howmany
         * @param {Array} items splice push items
         */
        const XhearEleProtoSplice = (t, index, howmany, items = []) => {
            let _this = t[XDATASELF];

            // 返回的数组
            let reArr = [];

            // 小于0的index转换
            if (index < 0) {
                index += _this.length;
            }

            let tarele = _this.ele;
            let {
                children
            } = tarele;

            let c_howmany = !/\D/.test(howmany) ? howmany : _this.length;

            let oldArr = _this.map(e => e);

            while (c_howmany > 0) {
                let childEle = children[index];

                if (!childEle) {
                    break;
                }

                reArr.push(createXhearProxy(childEle));

                // 删除目标元素
                tarele.removeChild(childEle);

                // 数量减少
                c_howmany--;
            }

            // 定位目标子元素
            let tar = children[index];

            // 添加元素
            if (items.length) {
                let fragment = document.createDocumentFragment();
                items.forEach(e => fragment.appendChild(parseToDom(e)));
                if (index >= 0 && tar) {
                    tarele.insertBefore(fragment, tar)
                } else {
                    tarele.appendChild(fragment);
                }
            }

            // 触发index改动
            emitChildsXDataIndex(_this, oldArr);

            emitUpdate(_this, "splice", [index, howmany, ...items]);

            return reArr;
        }

        /**
         * 根据数组结构进行排序
         * @param {XhearEle} t 目标对象
         * @param {Array} arr 排序数组结构
         */
        const sortByArray = (t, arr) => {
            let _this = t[XDATASELF];
            let {
                ele
            } = _this;

            let childsBackup = Array.from(ele.children);
            let fragment = document.createDocumentFragment();
            arr.forEach(k => {
                let ele = childsBackup[k];
                if (ele.xvele) {
                    ele[RUNARRAY] = 1;
                }
                fragment.appendChild(ele);
            });
            ele.appendChild(fragment);
            childsBackup.forEach(ele => ele.xvele && (ele[RUNARRAY] = 0));
        }

        // 重置所有数组方法
        extend(XhearEleFn, {
            push(...items) {
                XhearEleProtoSplice(this, this.length, 0, items);
                return this.length;
            },
            splice(index, howmany, ...items) {
                return XhearEleProtoSplice(this, index, howmany, items);
            },
            unshift(...items) {
                XhearEleProtoSplice(this, 0, 0, items);
                return this.length;
            },
            shift() {
                return XhearEleProtoSplice(this, 0, 1);
            },
            pop() {
                return XhearEleProtoSplice(this, this.length - 1, 1);
            },
            reverse() {
                let oldArr = this.map(e => e);
                let childs = Array.from(this.ele.children);
                let len = childs.length;
                sortByArray(this, childs.map((e, i) => len - 1 - i));

                // 触发index改动
                emitChildsXDataIndex(this, oldArr);
                emitUpdate(this[XDATASELF], "reverse", []);
            },
            sort(arg) {
                let oldArr = this.map(e => e);

                if (isFunction(arg)) {
                    // 新生成数组
                    let fake_this = Array.from(this.ele.children).map(e => createXhearProxy(e));
                    let backup_fake_this = Array.from(fake_this);

                    // 执行排序函数
                    fake_this.sort(arg);

                    // 记录顺序
                    arg = [];
                    let putId = getRandomId();

                    fake_this.forEach(e => {
                        let id = backup_fake_this.indexOf(e);
                        // 防止查到重复值，所以查到过的就清空覆盖
                        backup_fake_this[id] = putId;
                        arg.push(id);
                    });
                }

                if (arg instanceof Array) {
                    // 修正新顺序
                    sortByArray(this, arg);
                }

                // 触发index改动
                emitChildsXDataIndex(this, oldArr);

                emitUpdate(this[XDATASELF], "sort", [arg]);
            }
        });
        // x-fill 操作足够复杂，使用单独一个文件进行封装
        // 舍弃原来的component带入模式，因为 template 内就能使用 component
        // 在数据量小的时候使用，还是很方便的

        // 根据itemData生成一个绑定数据的组件元素或模板元素
        const createFillItem = ({
            useTempName,
            temps,
            itemData,
            host,
            parent,
            index
        }) => {
            let template = temps.get(useTempName);

            if (!template) {
                throw {
                    desc: "find out the template",
                    name: useTempName,
                    targetElement: host.ele
                };
            }

            // 伪造一个挂载元素的数据
            let fakeData;

            if (itemData instanceof XData) {
                fakeData = createXData({
                    $data: itemData.mirror,
                    $host: ((host.$host && host.$data) ? host.$host : host).mirror,
                    get $parent() {
                        return parent;
                    },
                    get $index() {
                        return itemData.index !== undefined ? itemData.index : index;
                    }
                });
            } else {
                fakeData = createXData({
                    get $data() {
                        return itemData;
                    },
                    set $data(val) {
                        parent[index] = val;
                        // parent.setData(index, val);
                    },
                    $host: ((host.$host && host.$data) ? host.$host : host).mirror,
                    get $parent() {
                        return parent;
                    },
                    get $index() {
                        return itemData.index !== undefined ? itemData.index : index;
                    }
                });
            }

            fakeData[CANSETKEYS] = new Set();

            fakeData = fakeData[PROXYTHIS];

            let xNode = createXhearEle(parseToDom(template.innerHTML));

            xNode._update = false;
            xNode.__fill_item = itemData;
            xNode.__fake_item = fakeData;

            renderTemp({
                sroot: xNode.ele,
                proxyEle: fakeData,
                temps
            });

            return {
                itemEle: xNode,
                fakeData
            };
        }

        /**
         * 对fill的目标对象，进行伪造虚拟对象渲染
         * @param {Element} ele 需要塞入 fake fill 的元素
         */
        const renderFakeFill = ({
            ele,
            attrName,
            useTempName,
            host,
            temps
        }) => {
            // 等待填充的 x-fill 元素
            let targetFillEle = createXhearProxy(ele);

            // 禁止元素内的update冒泡
            targetFillEle._update = false;

            let tarData = host[attrName];

            // 首次填充元素
            tarData.forEach((itemData, index) => {
                let {
                    itemEle
                } = createFillItem({
                    useTempName,
                    itemData,
                    temps,
                    host,
                    parent: tarData,
                    index
                });

                ele.appendChild(itemEle.ele);
            });

            // 监听变动，重新设置元素
            host.watch(attrName, e => {
                let targetVal = host[attrName];

                e.trends.forEach(trend => {
                    let keys = trend.keys.slice();

                    // 数据设置整个数组
                    if (trend.name == "setData" && trend.keys.length < attrName.split(".").length) {
                        keys.push(trend.args[0]);
                    }

                    if (attrName == keys.join(".")) {
                        // 针对当前节点的变动
                        nextTick(() => {
                            // 防止变动再更新
                            targetVal = host[attrName];

                            targetFillEle.forEach(itemEle => {
                                let eleItemData = itemEle.__fill_item;

                                if (!(eleItemData instanceof XData)) {
                                    itemEle.ele.parentNode.removeChild(itemEle.ele);
                                } else if (!targetVal.includes(eleItemData)) {
                                    // 删除不在数据对象内的元素
                                    itemEle.__fill_item = null;
                                    itemEle.ele.parentNode.removeChild(itemEle.ele);
                                } else {
                                    // 在元素对象内的，提前预备不内部操作的记号
                                    itemEle.ele[RUNARRAY] = 1;
                                }
                            });

                            // 等待放开记号的元素
                            let need_open_runarray = targetFillEle.map(e => e.ele);

                            // 等待重新填充新的元素
                            let fragment = document.createDocumentFragment();

                            targetVal.forEach((itemData, index) => {
                                let tarItem = targetFillEle.find(e => e.__fill_item == itemData);

                                if (tarItem) {
                                    fragment.appendChild(tarItem.ele);
                                } else {
                                    // 新数据重新生成元素
                                    let {
                                        itemEle
                                    } = createFillItem({
                                        useTempName,
                                        itemData,
                                        temps,
                                        host,
                                        parent: targetVal,
                                        index
                                    });

                                    fragment.appendChild(itemEle.ele);
                                }
                            });

                            // 重新填充
                            targetFillEle.ele.appendChild(fragment);

                            need_open_runarray.forEach(ele => ele[RUNARRAY] = 0);

                        }, targetVal);
                    }
                });
            });
        }

        // 注册数据
        const regDatabase = new Map();

        const RUNARRAY = Symbol("runArray");

        // 渲染结束标记
        const RENDEREND = Symbol("renderend"),
            RENDEREND_RESOLVE = Symbol("renderend_resove"),
            RENDEREND_REJECT = Symbol("renderend_reject");

        const ATTRBINDINGKEY = "attr" + getRandomId();

        // 是否表达式
        const isFunctionExpr = (str) => {
            argsWReg.lastIndex = 0;
            return argsWReg.test(str.trim())
        };

        // 转化为指向this的函数表达式
        const argsWReg = /(".*?"|'.*?'|\(|\)|\[|\]|\{|\}|\|\||\&\&|\?|\!|:| |\+|\-|\*|%|\,|\<|\>)/g;
        // const argsWReg_c = /(".*?"|'.*?'|\(|\)|\[|\]|\{|\}|\|\||\&\&|\?|\!|:| |\+|\-|\*|%|\,|[\<\>\=]?[=]?=|\<|\>)/;
        // const ignoreArgKeysReg = /(^\$event$|^\$args$|^debugger$|^console\.|^Number$|^String$|^Object$|^Array$|^parseInt$|^parseFloat$|^undefined$|^null$|^true$|^false$|^[\d])/;

        // const argsWithThis = (expr) => {
        //     // 替换字符串用的唯一key
        //     const sKey = "$$" + getRandomId() + "_";

        //     let jump_strs = [];

        //     // 规避操作
        //     let before_expr = expr.replace(/\? *[\w]+?:/g, e => {
        //         let replace_key = "__" + getRandomId() + "__";

        //         jump_strs.push({
        //             k: replace_key,
        //             v: e
        //         });

        //         return replace_key;
        //     });

        //     // 先抽取json结构的Key，防止添加this，后面再补充回去
        //     let after_expr = before_expr.replace(/[\w]+? *:/g, (e) => {
        //         return `${sKey}${e}`;
        //     });

        //     // 还原规避字符串
        //     jump_strs.forEach(e => {
        //         after_expr = after_expr.replace(e.k, e.v);
        //     });

        //     // 针对性的进行拆分
        //     let argsSpArr = after_expr.split(argsWReg).map(e => {
        //         if (e.includes(sKey)) {
        //             return e.replace(sKey, "");
        //         }
        //         if (argsWReg_c.test(e) || !e.trim() || /^\./.test(e) || ignoreArgKeysReg.test(e)) {
        //             return e;
        //         }
        //         return `this.${e}`;
        //     });

        //     return argsSpArr.join("");
        // }

        // 使用with性能不好，所以将内部函数变量转为指向this的函数
        // const funcExprWithThis = (expr) => {
        //     let new_expr = "";

        //     let w_arr = expr.split(";").filter(e => !!e);

        //     if (w_arr.length > 1) {
        //         w_arr.forEach(e => {
        //             new_expr += "\n" + argsWithThis(e) + ";";
        //         });
        //     } else {
        //         new_expr = `return ${argsWithThis(w_arr[0])}`;
        //     }

        //     return new_expr;
        // }

        // 获取函数
        const exprToFunc = (expr) => {
            // return new Function("...args", `
            // const $event = args[0];
            // const $args = args;
            // args = undefined;

            // try{
            //     ${funcExprWithThis(expr)}
            // }catch(e){
            // let ele = this.ele;
            // if(!ele && this.$host){
            //     ele = this.$host.ele;
            // }
            // let errObj = {
            //     expr:'${expr.replace(/'/g, "\\'").replace(/"/g, '\\"')}',
            //     target:ele,
            //     error:e
            // }
            // ele && ele.__xInfo && Object.assign(errObj,ele.__xInfo);
            // console.error(errObj);
            // }
            //         `);

            return new Function("...args", `
    const $event = args[0];
    const $args = args;
    args = undefined;
    with(this){
        try{
            return ${expr}
        }catch(e){
            let ele = this.ele;
            if(!ele && this.$host){
                ele = this.$host.ele;
            }
            let errObj = {
                expr:'${expr.replace(/'/g, "\\'").replace(/"/g, '\\"')}',
                target:ele,
                error:e
            }
            ele && ele.__xInfo && Object.assign(errObj,ele.__xInfo);
            console.error(errObj);
        }
    }
        `);
        }

        const register = (opts) => {
            let defaults = {
                // 自定义标签名
                tag: "",
                // 正文内容字符串
                temp: "",
                // 和attributes绑定的keys
                attrs: [],
                // 默认数据
                data: {},
                // 直接监听属性变动对象
                watch: {},
                // 原型链上的方法
                // proto: {},
                // 初始化完成后触发的事件
                // ready() {},
                // 添加进document执行的callback
                // attached() {},
                // 删除后执行的callback
                // detached() {}
            };

            Object.assign(defaults, opts);

            let attrs = defaults.attrs;

            let attrsType = getType(attrs);
            if (attrsType == "object") {
                // 修正数据
                let n_attrs = Object.keys(attrs);

                n_attrs.forEach(attrName => {
                    defaults.data[attrToProp(attrName)] = attrs[attrName];
                });

                attrs = defaults.attrs = n_attrs.map(e => attrToProp(e));
            } else if (attrsType == "array") {
                // 修正属性值
                attrs = defaults.attrs = attrs.map(e => attrToProp(e));
            }

            defaults.data = cloneObject(defaults.data);
            defaults.watch = Object.assign({}, defaults.watch);

            // 转换tag
            let tag = defaults.tag = propToAttr(defaults.tag);

            // 自定义元素
            const CustomXhearEle = class extends XhearEle {
                constructor(...args) {
                    super(...args);

                    // 挂载渲染状态机
                    this[RENDEREND] = new Promise((resolve, reject) => {
                        this[RENDEREND_RESOLVE] = resolve;
                        // this[RENDEREND_REJECT] = reject;
                    });
                }

                get finish() {
                    return this[RENDEREND];
                }
            }

            defaults.proto && extend(CustomXhearEle.prototype, defaults.proto);

            // 注册组件的地址
            let scriptSrc = document.currentScript && document.currentScript.src;

            // 注册自定义元素
            const XhearElement = class extends HTMLElement {
                constructor() {
                    super();

                    // 设置相关数据
                    this.__xInfo = {
                        scriptSrc
                    };

                    // 删除旧依赖，防止组件注册前的xhear实例缓存
                    delete this.__xhear__;
                    let _xhearThis = new CustomXhearEle(this);

                    // 设置渲染识别属性
                    Object.defineProperty(this, "xvele", {
                        value: true
                    });
                    Object.defineProperty(_xhearThis, "xvele", {
                        value: true
                    });

                    let xvid = this.xvid = "xv" + getRandomId();

                    let options = Object.assign({}, defaults);

                    // 设置x-ele
                    if (this.parentElement) {
                        this.setAttribute("x-ele", "");
                    } else {
                        nextTick(() => this.setAttribute("x-ele", ""), xvid);
                    }

                    renderComponent(this, options);
                    options.ready && options.ready.call(_xhearThis[PROXYTHIS]);

                    options.slotchange && _xhearThis.$shadow.on('slotchange', (e) => options.slotchange.call(_xhearThis[PROXYTHIS], e))

                    Object.defineProperties(this, {
                        [RUNARRAY]: {
                            writable: true,
                            value: 0
                        }
                    });
                }

                connectedCallback() {
                    if (this[RUNARRAY]) {
                        return;
                    }
                    defaults.attached && defaults.attached.call(createXhearProxy(this));
                }

                disconnectedCallback() {
                    if (this[RUNARRAY]) {
                        return;
                    }

                    let _this = createXhearProxy(this)

                    defaults.detached && defaults.detached.call(_this);

                    // 深度清除数据
                    _this.deepClear();
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    let xEle = this.__xhear__;
                    name = attrToProp(name);
                    if (newValue != xEle[name]) {
                        xEle.setData(name, newValue);
                    }
                }

                static get observedAttributes() {
                    return attrs.map(e => propToAttr(e));
                }
            }

            Object.assign(defaults, {
                XhearElement
            });

            // 设置映射tag数据
            regDatabase.set(defaults.tag, defaults);

            customElements.define(tag, XhearElement);
        }

        // 定位元素
        const postionNode = (e) => {
            let textnode = document.createTextNode("");
            let par = e.parentNode;
            par.insertBefore(textnode, e);
            par.removeChild(e);

            return {
                textnode,
                par
            };
        }

        // render函数用元素查找（包含自身元素）
        const getCanRenderEles = (root, expr, opts = {
            rmAttr: true
        }) => {
            let arr = queAllToArray(root, expr).map(ele => {
                return {
                    ele
                };
            });

            if (root instanceof Element && createXhearEle(root).is(expr)) {
                arr.unshift({
                    ele: root
                });
            }

            // 对特殊属性进行处理
            let exData = /^\[(.+)\]$/.exec(expr);
            if (arr.length && exData) {
                let attrName = exData[1];

                arr.forEach(e => {
                    let {
                        ele
                    } = e;

                    let val = ele.getAttribute(attrName);
                    if (opts.rmAttr) {
                        ele.removeAttribute(attrName);
                        ele.setAttribute(`rendered-${attrName}`, val);
                    }
                    e.attrVal = val;
                });
            }

            return arr;
        }

        class XDataProcessAgent {
            constructor(proxyEle) {
                // 处理用寄存对象
                this.processObj = new Map();
                this.proxyEle = proxyEle;
                this._hasAdd = false;
            }

            init() {
                if (!this._hasAdd) {
                    // 没有添加就不折腾
                    return;
                }

                let {
                    processObj,
                    proxyEle
                } = this;

                const canSetKey = proxyEle[CANSETKEYS];

                // 根据寄存对象监听值
                for (let [expr, d] of processObj) {
                    let {
                        calls,
                        target
                    } = d;
                    target = target || proxyEle;

                    if (canSetKey.has(expr)) {
                        let watchFun;
                        target.watch(expr, watchFun = (e, val) => {
                            calls.forEach(d => d.change(val, e.trends));
                        });
                        nextTick(() => watchFun({}, target[expr]));

                        // 清除的话事假监听
                        proxyEle.on("clearxdata", e => {
                            // clearXData(target);
                            target.unwatch(expr, watchFun);
                        });
                    } else {
                        // 其余的使用函数的方式获取
                        let f = exprToFunc(expr);
                        let old_val;

                        let watchFun;
                        // 是否首次运行
                        let isFirst = 1;
                        target.watch(watchFun = e => {
                            let val = f.call(target);

                            if (isFirst) {
                                isFirst = 0;
                            } else if (val === old_val || (val instanceof XData && val.string === old_val)) {
                                return;
                            }

                            let trends = e ? e.trends : undefined;
                            calls.forEach(d => d.change(val, trends));

                            if (val instanceof XData) {
                                old_val = val.string;
                            } else {
                                old_val = val;
                            }
                        });
                        nextTick(() => watchFun({}));

                        // 清除的话事假监听
                        proxyEle.on("clearxdata", e => {
                            target.unwatch(watchFun);
                        });

                        // 同时监听index变动
                        target.on("updateIndex", watchFun);
                        // 监听主动触发
                        target.on("reloadView", watchFun);
                    }
                }
            }

            // 添加表达式监听
            add(expr, func) {
                let processObj = this.processObj;
                let calls = processObj.get(expr.trim());
                if (!calls) {
                    calls = [];
                    processObj.set(expr, {
                        calls
                    });
                } else {
                    calls = calls.calls;
                }

                calls.push({
                    change: func
                })

                this._hasAdd = true;
            }

            // 清除监听
            remove(expr, func) {
                let processObj = this.processObj;
                let calls = processObj.get(expr.trim());
                if (calls) {
                    calls = calls.calls;
                    let tarIndex = calls.findIndex(e => e.change === func);
                    calls.splice(tarIndex, 1);
                }
            }
        }

        /**
         * 转换元素内的特殊模板语法为模板属性
         * @param {Element} sroot 需要转换模板属性的元素
         */
        const transTemp = (sroot) => {
            let templateId = getRandomId();

            // 重新中转内部特殊属性
            getCanRenderEles(sroot, "*").forEach(e => {
                let {
                    ele
                } = e;

                let attrbs = Array.from(ele.attributes);

                // 结束后要去除的属性
                let attrsRemoveKeys = new Set();

                // 事件绑定数据
                let bindEvent = {};

                // 属性绑定数据
                let bindAttr = {};

                attrbs.forEach(obj => {
                    let {
                        name,
                        value
                    } = obj;
                    name = attrToProp(name);

                    // 重定向目标
                    if (name === "$") {
                        ele.setAttribute("x-target", value);
                        attrsRemoveKeys.add(name);
                        return;
                    }

                    // 事件绑定
                    let eventExecs = /^@(.+)/.exec(name);
                    if (eventExecs) {
                        bindEvent[eventExecs[1]] = value;
                        attrsRemoveKeys.add(name);
                        return;
                    }

                    // 属性绑定
                    let attrExecs = /^:(.+)/.exec(name);
                    if (attrExecs) {
                        bindAttr[attrExecs[1]] = value;
                        attrsRemoveKeys.add(name);
                        return;
                    }
                });

                let bindEventStr = JSON.stringify(bindEvent);
                if (bindEventStr != "{}") {
                    ele.setAttribute("x-on", bindEventStr);
                }

                let bindAttrStr = JSON.stringify(bindAttr);
                if (bindAttrStr != "{}") {
                    ele.setAttribute("x-bind", bindAttrStr);
                }

                attrsRemoveKeys.forEach(k => {
                    ele.removeAttribute(propToAttr(k))
                });

                if (ele.getAttribute("x-model")) {
                    ele.setAttribute("x-model-id", templateId);
                }
            });

            return {
                templateId
            };
        }


        // 渲染shadow dom 的内容
        const renderTemp = ({
            sroot,
            proxyEle,
            temps,
            templateId
        }) => {
            let xpAgent = new XDataProcessAgent(proxyEle);

            const canSetKey = proxyEle[CANSETKEYS];

            // if (!templateId) {
            //     let d = transTemp(sroot);
            //     templateId = d.templateId;
            // }

            // x-if 为了递归组件和模板，还有可以节省内存的情况
            getCanRenderEles(sroot, "[x-if]").forEach(e => {
                let {
                    ele,
                    attrVal
                } = e;

                // 定位元素
                let {
                    textnode,
                    par
                } = postionNode(ele);

                let iTempEle = e.ele;

                let targetEle;

                xpAgent.add(attrVal, val => {
                    if (!val && targetEle) {
                        par.removeChild(targetEle.ele);
                        targetEle = null;
                    } else if (val && !targetEle) {
                        targetEle = createXhearProxy(parseToDom(iTempEle.innerHTML));
                        par.insertBefore(targetEle.ele, textnode);
                        renderTemp({
                            sroot,
                            proxyEle,
                            temps,
                            xpAgent,
                            templateId
                        });
                    }
                });
            });

            // x-fill 填充数组，概念上相当于数组在html中的slot元素
            // x-fill 相比 for 更能发挥 stanz 数据结构的优势；更好的理解多重嵌套的数据结构；
            let xFills = getCanRenderEles(sroot, '[x-fill]');
            if (xFills.length) {
                xFills.forEach(e => {
                    let {
                        ele,
                        attrVal
                    } = e;

                    let matchAttr = attrVal.match(/(.+?) +use +(.+)/)

                    if (!matchAttr) {
                        console.error({
                            expr: attrVal,
                            desc: "fill expression error",
                        });
                        return;
                    }

                    // attrName 引用填充的属性名
                    // contentName 填充的内容，带 - 名的为自定义组件，其他为填充模板
                    let [, attrName, contentName] = matchAttr;

                    renderFakeFill({
                        ele,
                        attrName,
                        useTempName: contentName,
                        host: proxyEle,
                        temps
                    });
                });
            }

            // x-target
            getCanRenderEles(sroot, "[x-target]").forEach(e => {
                let {
                    ele,
                    attrVal
                } = e;

                Object.defineProperty(proxyEle, "$" + attrVal, {
                    get: () => createXhearProxy(ele)
                });
            });

            // x-show
            getCanRenderEles(sroot, "[x-show]").forEach(e => {
                let {
                    ele,
                    attrVal
                } = e;

                xpAgent.add(attrVal, val => {
                    if (val) {
                        ele.style.display = "";
                    } else {
                        ele.style.display = "none";
                    }
                });
            });

            // 文本渲染
            getCanRenderEles(sroot, "x-span").forEach(e => {
                let {
                    ele
                } = e;

                // 定位元素
                let {
                    textnode,
                    par
                } = postionNode(ele);

                let expr = ele.getAttribute('xvkey');

                xpAgent.add(expr, val => {
                    if (val instanceof XData) {
                        val = val.string;
                    } else {
                        val = String(val);
                    }
                    textnode.textContent = val;
                });
            });

            // 事件修正
            getCanRenderEles(sroot, `[x-on]`).forEach(e => {
                let {
                    ele,
                    attrVal
                } = e;

                let data = JSON.parse(attrVal);

                let $ele = createXhearEle(ele);

                Object.keys(data).forEach(eventStr => {
                    let [eventName, ...opts] = eventStr.split('.');

                    let prop = data[eventStr];

                    let func;
                    if (isFunctionExpr(prop)) {
                        func = exprToFunc(prop);
                    } else {
                        func = proxyEle[prop];
                    }

                    let functionName = "on";
                    if (opts.includes("once")) {
                        functionName = "one";
                    }

                    let isFunc = isFunction(func);
                    if (!isFunc) {
                        console.warn({
                            target: sroot,
                            eventName,
                            desc: "no binding functions"
                        });
                    }

                    $ele[functionName](eventName, (event, data) => {
                        if (opts.includes("prevent")) {
                            event.preventDefault();
                        }

                        if (opts.includes("stop")) {
                            event.bubble = false;
                        }

                        isFunc && func.call(proxyEle, event, data);
                    });
                });
            });

            // 属性修正
            getCanRenderEles(sroot, `[x-bind]`).forEach(e => {
                let {
                    ele,
                    attrVal
                } = e;

                let data = JSON.parse(attrVal);

                Object.keys(data).forEach(attrName => {
                    let expr = data[attrName];

                    let isEachBinding = /^#(.+)/.exec(attrName);
                    if (isEachBinding) {
                        attrName = isEachBinding[1];
                        isEachBinding = !!isEachBinding;

                        // 函数表达式不能用于双向绑定
                        if (isFunctionExpr(expr)) {
                            throw {
                                desc: "Function expressions cannot be used for sync binding",
                            };
                        } else if (!canSetKey.has(expr) && !/^\$data\./.test(expr) && expr !== "$data") {
                            // 不能双向绑定的值
                            console.error({
                                desc: "the key can't sync bind",
                                key: "attrName",
                                target: ele,
                                host: proxyEle
                            });
                        }

                        // 数据反向绑定
                        createXhearEle(ele).watch(attrName, (e, val) => {
                            proxyEle.setData(expr, val);
                        });
                    }

                    xpAgent.add(expr, val => {
                        if (val instanceof XhearEle) {
                            val = val.object;
                        }

                        if (ele.xvele) {
                            createXhearEle(ele).setData(attrName, val);
                        } else {
                            attrName = propToAttr(attrName);
                            if (val === undefined || val === null) {
                                ele.removeAttribute(attrName);
                            } else {
                                ele.setAttribute(attrName, val);
                            }
                        }
                    });
                });
            });


            // 需要跳过的元素列表
            let xvModelJump = new Set();

            // 绑定 x-model
            getCanRenderEles(sroot, `[x-model]`).forEach(e => {
                let {
                    ele,
                    attrVal
                } = e;

                if (xvModelJump.has(ele)) {
                    // checkbox已经添加过一次了
                    return;
                }

                let modelKey = attrVal;

                switch (ele.tagName.toLowerCase()) {
                    case "input":
                        let inputType = ele.getAttribute("type");
                        switch (inputType) {
                            case "checkbox":
                                // 判断是不是复数形式的元素
                                let allChecks = getCanRenderEles(sroot, `input[type="checkbox"][rendered-x-model="${modelKey}"][x-model-id="${templateId}"]`);

                                // 查看是单个数量还是多个数量
                                if (allChecks.length > 1) {
                                    allChecks.forEach(e => {
                                        let checkbox = e.ele;
                                        checkbox.addEventListener('change', e => {
                                            let {
                                                value,
                                                checked
                                            } = e.target;

                                            let tarData = proxyEle.getData(modelKey);
                                            if (checked) {
                                                tarData.add(value);
                                            } else {
                                                tarData.delete(value);
                                            }
                                        });
                                    });

                                    // 添加到跳过列表里
                                    allChecks.forEach(e => {
                                        xvModelJump.add(e);
                                    })
                                } else {
                                    // 单个直接绑定checked值
                                    proxyEle.watch(modelKey, (e, val) => {
                                        ele.checked = val;
                                    }, true);
                                    ele.addEventListener("change", e => {
                                        let {
                                            checked
                                        } = ele;
                                        proxyEle.setData(modelKey, checked);
                                    });
                                }
                                return;
                            case "radio":
                                let allRadios = getCanRenderEles(sroot, `input[type="radio"][rendered-x-model="${modelKey}"][x-model-id="${templateId}"]`);

                                let rid = getRandomId();

                                allRadios.forEach(e => {
                                    let radioEle = e.ele;
                                    radioEle.setAttribute("name", `radio_${modelKey}_${rid}`);
                                    radioEle.addEventListener("change", e => {
                                        if (radioEle.checked) {
                                            proxyEle.setData(modelKey, radioEle.value);
                                        }
                                    });
                                });
                                return;
                        }
                        // 其他input 类型继续往下走
                        case "textarea":
                        case "text":
                            proxyEle.watch(modelKey, (e, val) => {
                                ele.value = val;
                            });
                            nextTick(() => ele.value = proxyEle[modelKey]);
                            ele.addEventListener("input", e => {
                                proxyEle.setData(modelKey, ele.value);
                            });
                            break;
                        case "select":
                            proxyEle.watch(modelKey, (e, val) => {
                                ele.value = val;
                            });
                            nextTick(() => ele.value = proxyEle[modelKey]);
                            ele.addEventListener("change", e => {
                                proxyEle.setData(modelKey, ele.value);
                            });
                            break;
                        default:
                            // 自定义组件
                            if (ele.xvele) {
                                let cEle = ele.__xhear__;
                                cEle.watch("value", (e, val) => {
                                    proxyEle.setData(modelKey, val);
                                });
                                proxyEle.watch(modelKey, (e, val) => {
                                    cEle.setData("value", val);
                                }, true);
                            } else {
                                console.warn(`can't x-model with thie element => `, ele);
                            }
                }
            });
            xvModelJump.clear();
            xvModelJump = null;

            xpAgent.init();
        }

        // 将x-if元素嵌套template
        const warpXifTemp = (html) => {
            let f_temp = document.createElement("template");

            f_temp.innerHTML = html;

            let ifEles = Array.from(f_temp.content.querySelectorAll("[x-if]"));

            // if元素添加 template 包裹
            ifEles.forEach(e => {
                if (e.tagName.toLowerCase() == "template") {
                    return;
                }

                let ifTempEle = document.createElement("template");
                ifTempEle.setAttribute("x-if", e.getAttribute("x-if"));
                e.removeAttribute("x-if");

                // 替换位置
                e.parentNode.insertBefore(ifTempEle, e);
                ifTempEle.content.appendChild(e);
            });

            // template 内的 x-if 也要转换
            Array.from(f_temp.content.querySelectorAll("template")).forEach(temp => {
                let {
                    html
                } = warpXifTemp(temp.innerHTML)
                temp.innerHTML = html;
            });

            let {
                templateId
            } = transTemp(f_temp.content);

            // 填充默认内容
            return {
                templateId,
                html: f_temp.innerHTML
            };
        }

        // 渲染组件元素
        const renderComponent = (ele, defaults) => {
            // 初始化元素
            let xhearEle = createXhearEle(ele);

            // 存储promise队列
            let renderTasks = [];

            // 合并 proto
            defaults.proto && extend(xhearEle, defaults.proto);

            let {
                temp
            } = defaults;
            let sroot;

            // 要设置的数据
            let rData = Object.assign({}, defaults.data);

            // 添加_exkey
            let canSetKey = Object.keys(rData);
            canSetKey.push(...defaults.attrs);
            canSetKey.push(...Object.keys(defaults.watch));
            canSetKey = new Set(canSetKey);
            canSetKey.forEach(k => {
                // 去除私有属性
                if (/^_.+/.test(k)) {
                    canSetKey.delete(k);
                }
            });
            let ck = xhearEle[CANSETKEYS];
            if (!ck) {
                Object.defineProperty(xhearEle, CANSETKEYS, {
                    value: canSetKey
                });
            } else {
                canSetKey.forEach(k => ck.add(k))
            }

            // 判断是否有value，进行vaule绑定
            if (canSetKey.has("value")) {
                Object.defineProperty(ele, "value", {
                    get() {
                        return xhearEle.value;
                    },
                    set(val) {
                        xhearEle.value = val;
                    }
                });
            }

            // watch事件绑定
            xhearEle.watch(defaults.watch);

            // attrs 上的数据
            defaults.attrs.forEach(attrName => {
                // 绑定值
                xhearEle.watch(attrName, d => {
                    if (d.val === null || d.val === undefined) {
                        ele.removeAttribute(propToAttr(attrName));
                    } else {
                        // 绑定值
                        ele.setAttribute(propToAttr(attrName), d.val);
                    }
                });
            });

            Object.keys(rData).forEach(k => {
                let val = rData[k];

                if (!isUndefined(val)) {
                    // xhearEle[k] = val;
                    xhearEle.setData(k, val);
                }
            });

            if (temp) {
                // 添加shadow root
                sroot = ele.attachShadow({
                    mode: "open"
                });

                // 去除无用的代码（注释代码）
                temp = temp.replace(/<!--.+?-->/g, "");

                // 自定义字符串转换
                var textDataArr = temp.match(/{{.+?}}/g);
                textDataArr && textDataArr.forEach((e) => {
                    var key = /{{(.+?)}}/.exec(e);
                    if (key) {
                        temp = temp.replace(e, `<x-span xvkey="${key[1].trim()}"></x-span>`);
                    }
                });

                // 填充默认内容
                let {
                    html,
                    templateId
                } = warpXifTemp(temp);
                sroot.innerHTML = html;

                // 查找所有模板
                let temps = new Map();
                let tempEle = Array.from(sroot.querySelectorAll(`template[name]`));
                tempEle.length && tempEle.forEach(e => {
                    // 内部清除
                    e.parentNode.removeChild(e);

                    // 注册元素
                    let name = e.getAttribute("name");

                    temps.set(name, e);
                });

                renderTemp({
                    sroot,
                    proxyEle: xhearEle[PROXYTHIS],
                    temps,
                    templateId
                });
            }

            // 查找是否有link为完成
            if (sroot) {
                let links = queAllToArray(sroot, `link`);
                if (links.length) {
                    links.forEach(link => {
                        renderTasks.push(new Promise((resolve, reject) => {
                            if (link.sheet) {
                                resolve();
                            } else {
                                link.addEventListener("load", e => {
                                    resolve();
                                });
                                link.addEventListener("error", e => {
                                    reject({
                                        desc: "link load error",
                                        error: e,
                                        target: ele
                                    });
                                });
                            }
                        }));
                    });
                }
            }

            // 设置渲染完毕
            let setRenderend = () => {
                nextTick(() => ele.setAttribute("x-ele", 1), ele.xvid);
                xhearEle[RENDEREND_RESOLVE]();
                xhearEle.trigger('renderend', {
                    bubbles: false
                });
                setRenderend = null;
            }

            if (renderTasks.length) {
                Promise.all(renderTasks).then(() => {
                    setRenderend();
                });
            } else {
                setRenderend();
            }
        }

        const createXhearEle = ele => (ele.__xhear__ || new XhearEle(ele));
        const createXhearProxy = ele => createXhearEle(ele)[PROXYTHIS];

        // 全局用$
        let $ = (expr) => {
            if (expr instanceof XhearEle) {
                return expr;
            }

            let ele;

            if (getType(expr) === "string" && !/\<.+\>/.test(expr)) {
                ele = document.querySelector(expr);
            } else {
                ele = parseToDom(expr);
            }

            return ele ? createXhearProxy(ele) : null;
        }

        // 扩展函数（只是辅助将内部函数暴露出去而已）
        const ext = (callback) => {
            callback({
                // 渲染shadow的内部方法
                renderComponent
            });
        }

        Object.assign($, {
            register,
            nextTick,
            xdata: obj => createXData(obj)[PROXYTHIS],
            v: 5004000,
            version: "5.4.0",
            fn: XhearEleFn,
            isXhear,
            ext,
            all(expr) {
                return queAllToArray(document, expr).map(tar => createXhearProxy(tar));
            },
        });

        glo.$ = $;

    })(window);
    /*!
     * drill.js v3.5.5
     * https://github.com/kirakiray/drill.js
     * 
     * (c) 2018-2021 YAO
     * Released under the MIT License.
     */
    ((glo) => {
        "use strict";


        // function
        // 获取随机id
        const getRandomId = () => Math.random().toString(32).substr(2);
        var objectToString = Object.prototype.toString;
        var getType = value => objectToString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
        const isFunction = d => getType(d).search('function') > -1;
        var isEmptyObj = obj => !(0 in Object.keys(obj));

        //改良异步方法
        const nextTick = (() => {
            let isDebug = document.currentScript.getAttribute("debug") !== null;
            if (isDebug) {
                let nMap = new Map();
                return (fun, key) => {
                    if (!key) {
                        key = getRandomId();
                    }

                    let timer = nMap.get(key);
                    clearTimeout(timer);
                    nMap.set(key, setTimeout(() => {
                        fun();
                        nMap.delete(key);
                    }));
                };
            }

            // 定位对象寄存器
            let nextTickMap = new Map();

            let pnext = (func) => Promise.resolve().then(() => func())

            if (typeof process === "object" && process.nextTick) {
                pnext = process.nextTick;
            }

            let inTick = false;
            return (fun, key) => {
                if (!key) {
                    key = getRandomId();
                }

                nextTickMap.set(key, {
                    key,
                    fun
                });

                if (inTick) {
                    return;
                }

                inTick = true;

                pnext(() => {
                    if (nextTickMap.size) {
                        nextTickMap.forEach(({
                            key,
                            fun
                        }) => {
                            try {
                                fun();
                            } catch (e) {
                                console.error(e);
                            }
                            nextTickMap.delete(key);
                        });
                    }

                    nextTickMap.clear();
                    inTick = false;
                });
            };
        })();
        // 获取文件类型
        const getFileType = url => {
            let lastOri = url.split('/').pop();
            let fileType;
            let sArr = lastOri.match(/(.+)\.(.+)/);
            if (sArr) {
                // 得出文件类型
                fileType = sArr[2];
            }
            return fileType;
        };

        // 获取目录名
        const getDir = url => {
            url = url.replace(/(.+)#.+/, "$1");
            url = url.replace(/(.+)\?.+/, "$1");
            let urlArr = url.match(/(.+\/).*/);
            return urlArr && urlArr[1];
        };



        /**
         * 将相对路径写法改为绝对路径（协议开头）
         * @param {String} path 需要修正的路径
         * @param {String} relativeDir 相对目录
         */
        const getFullPath = (path, relativeDir) => {
            !relativeDir && (relativeDir = getDir(document.location.href));

            let new_path = path;

            // 如果不是协议开头，修正relativeDir
            if (!/^.+:\/\//.test(relativeDir)) {
                relativeDir = getDir(getFullPath(relativeDir));
            }

            // 不是绝对路径（协议+地址）的话进行修正
            if (!/^.+:\/\//.test(path)) {
                if (/^\/.+/.test(path)) {
                    // 基于根目录
                    new_path = location.origin + path;
                } else {
                    // 基于相对路径
                    new_path = relativeDir + path;
                }
            }

            return new_path;
        }

        //修正字符串路径
        const removeParentPath = (url) => {
            let urlArr = url.split(/\//g);
            let newArr = [];
            urlArr.forEach((e) => {
                if (e == '..' && newArr.length && (newArr.slice(-1)[0] != "..")) {
                    newArr.pop();
                    return;
                }
                newArr.push(e);
            });
            return newArr.join('/');
        };

        // common
        // 处理器（针对js类型）
        const processors = new Map();
        // 加载器（针对文件类型）
        const loaders = new Map();
        // 地址寄存器
        const bag = new Map();

        // 映射资源
        const paths = new Map();

        // 映射目录
        const dirpaths = {};

        // 是否离线
        let offline = false;
        // offline模式下，对文件的特殊处理
        const cacheDress = new Map();

        // 错误处理数据
        let errInfo = {
            // 加载错误之后，再次加载的间隔时间(毫秒)
            time: 100,
            // baseUrl后备仓
            backups: []
        };

        // 资源根路径
        let baseUrl = getDir(location.href);

        // 基础数据对象
        let base = {
            processors,
            loaders,
            bag,
            paths,
            dirpaths,
            errInfo,
            // 根目录
            baseUrl: "",
            // 临时挂起的模块对象
            tempM: {}
        };
        // loaders添加css
        loaders.set("css", (packData) => {
            return new Promise((res, rej) => {
                // 给主体添加css
                let linkEle = document.createElement('link');
                linkEle.rel = "stylesheet";
                linkEle.href = packData.link;

                let isInit = false;

                linkEle.onload = async () => {
                    res(async (e) => {
                        if (!isInit) {
                            isInit = true;
                            if (e.param.includes("-unAppend")) {
                                document.head.removeChild(linkEle);
                            }
                        }
                        return linkEle
                    });
                }

                linkEle.onerror = (e) => {
                    rej({
                        desc: "load link error",
                        target: linkEle,
                        event: e
                    });
                }

                // 添加到head
                document.head.appendChild(linkEle);
            });
        });

        // loaders添加json支持
        loaders.set("json", async (packData) => {
            let data = await fetch(packData.link);

            // 转换json格式
            data = await data.json();

            return async () => {
                return data;
            }
        });

        // loaders添加wasm支持
        loaders.set("wasm", async (packData) => {
            let data = await fetch(packData.link);

            // 转换arrayBuffer格式
            data = await data.arrayBuffer();

            // 转换wasm模块
            let module = await WebAssembly.compile(data);
            const instance = new WebAssembly.Instance(module);

            return async () => {
                return instance.exports;
            }
        });

        // loaders添加iframe辅助线程支持
        loaders.set("frame", async (packData) => {
            // 新建iframe
            let iframeEle = document.createElement("iframe");

            // 设置不可见样式
            Object.assign(iframeEle.style, {
                position: "absolute",
                "z-index": "-1",
                border: "none",
                outline: "none",
                opacity: "0",
                width: "0",
                height: "0"
            });

            // 转换并获取真实链接
            let {
                link,
                path
            } = packData;

            // 更新path
            let newPath = path.replace(/\.frame$/, "/frame.html");

            // 更新link
            let newLink = link.replace(path, newPath);

            // 设置链接
            iframeEle.src = newLink;

            // taskID记录器
            let taskIDs = new Map();

            // 添加计时器，当计算都完成时，计时10秒内，没有传入参数操作，就进行回收进程
            let clearer = () => {
                // 清除对象
                bag.delete(path);

                // 去除iframe
                document.body.removeChild(iframeEle);

                // 去除message监听
                window.removeEventListener("message", messageFun);

                // 快速内存回收
                messageFun = packData = clearer = null;
            };
            packData.timer = setTimeout(clearer, 10000);

            // 设置getPack函数
            let getPack = (urlData) => new Promise(res => {
                // 计算taskId
                let taskId = getRandomId();

                // 清除计时器
                clearTimeout(packData.timer);

                // 添加taskID和相应函数
                taskIDs.set(taskId, {
                    res
                });

                // 发送数据过去
                iframeEle.contentWindow.postMessage({
                    type: "drillFrameTask",
                    taskId,
                    data: urlData.data
                }, '*');
            })

            // 在 windows上设置接收器
            let messageFun;
            window.addEventListener("message", messageFun = e => {
                let {
                    data,
                    taskId
                } = e.data;

                // 判断是否在taskID内
                if (taskIDs.has(taskId)) {
                    // 获取记录对象
                    let taskObj = taskIDs.get(taskId);

                    // 去除taskID
                    taskIDs.delete(taskId);

                    // 返回数据
                    taskObj.res(data);
                }

                // 当库存为0时，计时清理函数
                if (!taskIDs.size) {
                    packData.timer = setTimeout(clearer, 10000);
                }
            });

            return new Promise((res, rej) => {
                // 加载完成函数
                iframeEle.addEventListener('load', e => {
                    res(getPack);
                });

                // 错误函数
                iframeEle.addEventListener('error', e => {
                    clearer();
                    rej();
                });

                // 添加到body
                document.body.appendChild(iframeEle);
            });
        });

        // loaders添加js加载方式
        loaders.set("js", (packData) => {
            return new Promise((resolve, reject) => {
                // 主体script
                let script = document.createElement('script');

                //填充相应数据
                script.type = 'text/javascript';
                script.async = true;
                script.src = packData.link;

                // 添加事件
                script.addEventListener('load', async () => {
                    // 根据tempM数据设置type
                    let {
                        tempM
                    } = base;

                    let getPack;

                    // type:
                    // file 普通文件类型
                    // define 模块类型
                    // task 进程类型
                    let {
                        type,
                    } = tempM;

                    // 进行processors断定
                    // 默认是file类型
                    let process = processors.get(type || "file");

                    if (process) {
                        getPack = await process(packData);
                    } else {
                        throw "no such this processor => " + type;
                    }

                    resolve(getPack);
                });
                script.addEventListener('error', () => {
                    // 加载错误
                    reject();
                });

                // 添加进主体
                document.head.appendChild(script);
            });
        });

        // 对es6 module 支持
        // 必须只是 async import 才可以使用
        try {
            eval(`
    loaders.set("mjs", async packData => {
        let d = await import(packData.link);

        return async () => {
            return d;
        }
    });
    `)
        } catch (e) {
            console.warn(`browser does not support asynchronous es module`);
        }
        // 直接返回缓存地址的类型
        const returnUrlSets = new Set(["png", "jpg", "jpeg", "bmp", "gif", "webp"]);

        const getLoader = (fileType) => {
            // 立即请求包处理
            let loader = loaders.get(fileType);

            if (!loader) {
                // console.log("no such this loader => " + fileType);
                loader = getByUtf8;
            }

            // 判断是否图片
            if (returnUrlSets.has(fileType)) {
                loader = getByUrl;
            }

            return loader;
        }

        // 获取并通过utf8返回数据
        const getByUtf8 = async packData => {
            let data = await fetch(packData.link);

            // 转换text格式
            data = await data.text();

            // 重置getPack
            return async () => {
                return data;
            }
        }

        // 返回内存的地址
        const getByUrl = async packData => {
            // 判断是否已经在缓存内
            if (packData.offlineUrl) {
                return async () => {
                    return packData.offlineUrl;
                }
            }

            let data = await fetch(packData.link);

            let fileBlob = await data.blob();

            let url = URL.createObjectURL(fileBlob);

            return async () => {
                return url;
            }
        }

        const isHttpFront = str => /^http/.test(str);

        /**
         * 加载包
         */
        class PackData {
            constructor(props) {
                Object.assign(this, props);

                // 包的getter函数
                // 包加载完成时候，有特殊功能的，请替换掉async getPack函数
                // async getPack(urlObj) { }

                // 加载状态
                // 1加载中
                // 2加载错误，重新装载中
                // 3加载完成
                // 4彻底加载错误，别瞎折腾了
                this.stat = 1;

                // 等待通行的令牌
                this.passPromise = new Promise((res, rej) => {
                    this._passResolve = res;
                    this._passReject = rej;
                });

                // 错误路径地址
                this.errPaths = [];
            }

            // 获取当前path的目录
            get dir() {
                return getDir(this.path);
            }

            // 获取备份path
            get nextLink() {
                // 获取备份path的同时，相当于进入等待重载的状态
                this.stat = 2;

                let backupId = (this._backupId != undefined) ? ++this._backupId : (this._backupId = 0);


                let {
                    backups
                } = errInfo;

                // 获取旧的base
                let oldBase = backups[backupId - 1] || base.baseUrl;

                // 获取下一个backup地址
                let nextBase = backups[backupId];

                if (!nextBase) {
                    return;
                }

                let oldBaseStr = getFullPath(oldBase);
                let nextBaseStr = getFullPath(nextBase);

                this.errPaths.push(this.link);

                let link = this.link.replace(oldBaseStr, nextBaseStr);

                this.link = link;

                return link;
            }

            // 设置成功
            resolve(getPack) {
                this.getPack = getPack;
                this.stat = 3;
                this._passResolve();
            }

            // 通告pack错误
            reject() {
                this.stat = 4;
                this._passReject({
                    desc: `load source error`,
                    link: this.errPaths,
                    packData: this
                });
            }
        }

        let agent = async (urlObj) => {
            // getLink直接返回
            if (urlObj.param && (urlObj.param.includes("-getLink")) && !offline) {
                return Promise.resolve(urlObj.link);
            }

            // 根据url获取资源状态
            let packData = bag.get(urlObj.path);

            if (!packData) {
                packData = new PackData({
                    path: urlObj.path,
                    link: urlObj.link,
                    // 记录装载状态
                    fileType: urlObj.fileType,
                });

                // 设置包数据
                bag.set(urlObj.path, packData);

                // 存储错误资源地址
                while (true) {
                    try {
                        // 文件link中转
                        packData.link = await cacheSource({
                            packData
                        });

                        // 返回获取函数
                        let getPack = (await getLoader(urlObj.fileType)(packData)) || (async () => {});
                        packData.resolve(getPack);
                        break;
                    } catch (e) {
                        packData.stat = 2;
                        if (isHttpFront(urlObj.str)) {
                            // http引用的就别折腾
                            packData.reject();
                            break;
                        }

                        // 获取下一个链接
                        let nextBackupLink = packData.nextLink;

                        if (!nextBackupLink) {
                            packData.reject();
                            break;
                        }

                        // 等待重试
                        await new Promise(res => setTimeout(res, errInfo.time));
                    }
                }
            }

            // 等待通行证
            await packData.passPromise;

            // 在offline情况下，返回link
            if (urlObj.param && (urlObj.param.includes("-getLink")) && offline) {
                return Promise.resolve(packData.link);
            }

            return await packData.getPack(urlObj);
        }
        const drill = {
            load(...args) {
                return load(toUrlObjs(args));
            },
            remove(url) {
                let {
                    path
                } = fixUrlObj({
                    str: url
                });

                if (bag.has(path)) {
                    bag.delete(path);

                    //告示删除成功
                    return !0;
                } else {
                    console.warn(`pack %c${url}`, "color:red", `does not exist`);
                }
            },
            has(url) {
                let {
                    path
                } = fixUrlObj({
                    str: url
                });

                let packData = bag.get(path);

                return packData && packData.stat;
            },
            config(options) {
                options.baseUrl && (base.baseUrl = options.baseUrl);

                //配置paths
                let oPaths = options.paths;
                oPaths && Object.keys(oPaths).forEach(i => {
                    let val = oPaths[i];
                    if (/^@.+\/$/.test(i)) {
                        let regStr = "^" + i;

                        // 修正单点
                        val = val.replace(/\/\.\//, "/")

                        // 如果修正相对目录 
                        if (/^\.\./.test(val)) {
                            val = removeParentPath(getDir(document.location.href) + base.baseUrl + val);
                        } else if (/^\//.test(val)) {
                            val = location.origin + val;
                        }

                        let reg = new RegExp(regStr);

                        //属于目录类型
                        dirpaths[i] = {
                            // 正则
                            reg,
                            // 值
                            value: val
                        };
                    } else if (/^\w+$/.test(i)) {
                        //属于资源类型
                        paths.set(i, val);
                    } else {
                        console.warn("this Paths settings do not meet specifications", i);
                    }
                });

                // 后备仓
                if (base.baseUrl && options.backups) {
                    options.backups.forEach(url => errInfo.backups.push(url));
                }
            },
            // 扩展开发入口
            ext(f_name, func) {
                if (isFunction(f_name)) {
                    f_name(base);
                } else {
                    // 旧的方法
                    let oldFunc;

                    // 中间件方法
                    let middlewareFunc = (...args) => func(args, oldFunc, base);

                    switch (f_name) {
                        case "fixUrlObj":
                            oldFunc = fixUrlObj;
                            fixUrlObj = middlewareFunc;
                            break;
                        case "load":
                            oldFunc = load;
                            load = middlewareFunc;
                            break;
                        case "agent":
                            oldFunc = agent;
                            agent = middlewareFunc;
                            break;
                        case "cacheSource":
                            oldFunc = cacheSource;
                            cacheSource = middlewareFunc;
                            break;
                    }
                }
            },
            cacheInfo: {
                k: "d_ver",
                v: ""
            },
            // 是否离线
            get offline() {
                return offline;
            },
            set offline(val) {
                if (offline) {
                    console.error("offline mode has been activated");
                    return;
                }
                offline = val;
            },
            debug: {
                bag
            },
            version: "3.5.5",
            v: 3005005
        };
        // 设置类型加载器的函数
        const setProcessor = (processName, processRunner) => {
            processors.set(processName, async (packData) => {
                let tempData = base.tempM.d;
                // 提前清空
                base.tempM = {};
                return await processRunner(packData, tempData, {
                    // 相对的加载函数
                    relativeLoad(...args) {
                        return load(toUrlObjs(args, packData.dir));
                    }
                });
            });

            // 特定类型记录器
            let processDefineFunc = (d) => {
                base.tempM = {
                    type: processName,
                    d
                };
            }

            drill[processName] || (drill[processName] = processDefineFunc);
            glo[processName] || (glo[processName] = processDefineFunc);
        }

        // 设置缓存中转器的函数
        const setCacheDress = (cacheType, dressRunner) => {
            cacheDress.set(cacheType, async ({
                file,
                packData
            }) => {
                let newFile = file;

                // 解析为文本
                let backupFileText = await file.text();

                let fileText = await dressRunner({
                    fileText: backupFileText,
                    file,
                    relativeLoad: (...args) => {
                        return load(toUrlObjs(args, packData.dir));
                    }
                });

                if (backupFileText !== fileText) {
                    // 重新生成file
                    newFile = new File([fileText], file.name, {
                        type: file.type
                    });
                }

                return newFile;
            });
        }

        // 主体加载函数
        let load = (urlObjs) => {
            let pendFunc;
            let p = new Promise((res, rej) => {
                // 要返回的数据
                let reValue = [];

                // 获取原来的长度
                let {
                    length
                } = urlObjs;
                let sum = length;

                // 是否有出错
                let hasError = [];

                urlObjs.forEach(async (obj, i) => {
                    // 载入的状态
                    let stat = "succeed";

                    // 中转加载资源
                    let d;

                    // 等待一次异步操作，确保post数据完整
                    await new Promise(res => nextTick(res))

                    d = await agent(obj).catch(e => {
                        stat = "error";
                        Object.assign(obj, {
                            type: "error",
                            descript: e
                        });
                        hasError.push(obj);
                    });

                    // 设置数据
                    reValue[i] = d;

                    // 触发pending
                    pendFunc && pendFunc({
                        // 当前所处id
                        id: i,
                        // 总数
                        sum,
                        ready: sum - length + 1,
                        stat
                    });

                    // 计时减少
                    length--;

                    if (!length) {
                        if (!hasError.length) {
                            // 单个的话直接返回单个的数据
                            if (sum == 1) {
                                res(d);
                            } else {
                                res(reValue);
                            }
                        } else {
                            // 出错了
                            rej(hasError);
                        }
                        reValue = null;
                    }
                });
            });

            // 挂载两个方法
            p.post = function(data) {
                urlObjs.forEach(e => e.data = data);
                return this;
            };
            p.pend = function(func) {
                pendFunc = func;
                return this;
            };

            return p;
        }

        // 转换出url字符串对象
        let fixUrlObj = (urlObj) => {
            let {
                // 最初的输入文本，千万不能覆盖这个值
                str,
                // 相对目录
                relative
            } = urlObj;

            // 判断是否注册在bag上的直接的id
            if (bag.has(str)) {
                let tarBag = bag.get(str);
                Object.assign(urlObj, {
                    path: tarBag.path,
                    link: tarBag.link,
                });
                return urlObj;
            }

            let
                // 挂载在bag上的链接key
                path,
                // 最终加载的链接
                link,
                // 链接上的search数据
                search,
                // 加载文件的类型
                fileType,
                // 空格拆分后的参数
                param;

            // 拆分空格数据
            [path, ...param] = str.split(/\s/).filter(e => e && e);

            // 抽离search数据
            search = path.match(/(.+)\?(\S+)$/) || "";
            if (search) {
                path = search[1];
                search = search[2];
            }

            // 查看是否有映射路径
            let tarPath = paths.get(path);
            if (tarPath) {
                // 映射路径修正
                path = tarPath;
            } else {
                // 映射目录修正
                for (let i in dirpaths) {
                    let tar = dirpaths[i];
                    if (tar.reg.test(path)) {
                        path = path.replace(tar.reg, tar.value);
                        break
                    }
                }
            }

            // 确保是绝对路径
            if (!/^.+:\/\//.test(path)) {
                // 判断是否有基于根目录参数
                if (param.includes('-r')) {
                    path = getFullPath(path);
                } else if (/^\./.test(path)) {
                    // 获取修正后的地址
                    path = getFullPath(path, relative || base.baseUrl);
                } else {
                    path = getFullPath(path, base.baseUrl);
                }
            }

            // 修正无用单点路径
            path = path.replace(/\/\.\//, "/");

            // 修正两点（上级目录）
            if (/\.\.\//.test(path)) {
                path = removeParentPath(path);
            }

            // 得出fileType
            fileType = getFileType(path);

            if (!fileType) {
                // 空的情况下
                if (!/\/$/.test(path)) {
                    if (param.includes('-p')) {
                        // 带包修正
                        path = path + "/" + path.replace(/.+\/(.+)/, "$1");
                    }

                    // 判断不是 / 结尾的，加上js修正
                    path += ".js";
                    fileType = "js";
                }
            }

            // 写入最终请求资源地址
            link = search ? (path + "?" + search) : path;

            {
                // 判断是否要加版本号
                let {
                    k,
                    v
                } = drill.cacheInfo;
                if (k && v && !param.includes("-unCacheSearch")) {
                    if (link.includes("?")) {
                        link = `${link}&${k}=${v}`;
                    } else {
                        link = `${link}?${k}=${v}`;
                    }
                }
            }

            // 对 -mjs 参数修正
            if (param.includes("-mjs")) {
                fileType = "mjs";
            }

            Object.assign(urlObj, {
                // 真正的访问地址
                link,
                // 后置参数
                search,
                // 加载类型
                fileType,
                // 挂载地址
                path: path.replace(location.origin, ""),
                // 空格参数
                param
            });

            return urlObj;
        }

        // 轻转换函数
        const toUrlObjs = (args, relative) => {
            // 生成组id
            let groupId = getRandomId();

            // 转化成urlObj
            return args.map((url, id) => fixUrlObj({
                loadId: getRandomId(),
                id,
                str: url,
                groupId,
                relative
            }));
        }
        // processors添加普通文件加载方式
        processors.set("file", (packData) => {
            // 直接修改完成状态，什么都不用做
        });

        // 添加define模块支持
        setProcessor("define", async (packData, d, {
            relativeLoad
        }) => {
            let exports = {},
                module = {
                    exports
                };

            // 根据内容填充函数
            if (isFunction(d)) {
                let {
                    path,
                    dir
                } = packData;

                // 函数类型
                d = d(relativeLoad, exports, module, {
                    FILE: path,
                    DIR: dir
                });
            }

            // Promise函数
            if (d instanceof Promise) {
                // 等待获取
                d = await d;
            }

            // 判断值是否在 exports 上
            if (!d && !isEmptyObj(module.exports)) {
                d = module.exports;
            }

            return async () => {
                return d;
            };
        });

        // 添加task模块支持
        setProcessor("task", (packData, d, {
            relativeLoad
        }) => {
            // 判断d是否函数
            if (!isFunction(d)) {
                throw 'task must be a function';
            }

            let {
                path,
                dir
            } = packData;

            // 修正getPack方法
            return async (urlData) => {
                let reData = await d(relativeLoad, urlData.data, {
                    FILE: path,
                    DIR: dir
                });

                return reData;
            }
        });

        // 添加init模块支持
        setProcessor("init", (packData, d, {
            relativeLoad
        }) => {
            // 判断d是否函数
            if (!isFunction(d)) {
                throw 'init must be a function';
            }

            let {
                path,
                dir
            } = packData;

            let isRun = 0;
            let redata;

            // 修正getPack方法
            return async (urlData) => {
                if (isRun) {
                    return redata;
                }

                // 等待返回数据
                redata = await d(relativeLoad, urlData.data, {
                    FILE: path,
                    DIR: dir
                });

                // 设置已运行
                isRun = 1;

                return redata;
            }
        });

        // 设置 css 缓存中转，对css引用路径进行修正
        setCacheDress("css", async ({
            fileText,
            relativeLoad
        }) => {
            // 获取所有import字符串
            let importArrs = fileText.match(/@import ["'](.+?)["']/g);
            if (importArrs) {
                // 缓存外部样式
                await Promise.all(importArrs.map(async e => {
                    let path = e.replace(/@import ["'](.+?)["']/, "$1");

                    let link = await relativeLoad(`${path} -getLink`);

                    // 修正相应路径
                    fileText = fileText.replace(e, `@import "${link}"`);
                }));
            }

            // 缓存外部资源
            let urlArrs = fileText.match(/url\((.+?)\)/g);
            if (urlArrs) {
                await Promise.all(urlArrs.map(async e => {
                    // 获取资源路径
                    let path = e.replace(/url\((.+?)\)/, "$1").replace(/["']/g, "");

                    // 确定不是协议http|https的才修正
                    if (/(^http:)|(^https:)/.test(path)) {
                        return Promise.resolve("");
                    }

                    let link = await relativeLoad(`${path} -getLink`);

                    // 修正相应路径
                    fileText = fileText.replace(e, `url("${link}")`);
                }));
            }

            return fileText;
        });

        // 对mjs引用路径进行修正
        setCacheDress("mjs", async ({
            fileText,
            relativeLoad
        }) => {
            // import分组获取
            let importsArr = fileText.match(/import .+ from ['"](.+?)['"];/g)

            if (importsArr) {
                await Promise.all(importsArr.map(async e => {
                    let exArr = e.match(/(import .+ from) ['"](.+?)['"];/, "$1");

                    if (exArr) {
                        let path = exArr[2];

                        // 获取对应的链接地址
                        let link = await relativeLoad(`${path} -getLink`);

                        fileText = fileText.replace(e, `${exArr[1]} "${link}"`);
                    }
                }))
            }

            let asyncImports = fileText.match(/import\(.+?\)/g);
            if (asyncImports) {
                await Promise.all(asyncImports.map(async e => {
                    let path = e.replace(/import\(["'](.+?)['"]\)/, "$1");
                    let link = await relativeLoad(`${path} -getLink`);

                    fileText = fileText.replace(e, `import("${link}")`);
                }));
            }

            return fileText;
        });
        const DBNAME = "drill-cache-db";
        const FILESTABLENAME = 'files';

        // 主体Database对象
        let mainDB;
        // 未处理的队列
        let isInitDB = new Promise((initDBResolve, reject) => {
            const indexedDB = glo.indexedDB || glo.webkitIndexedDB || glo.mozIndexedDB || glo.msIndexedDB;

            // 初始化数据库
            if (indexedDB) {
                // 初始打开
                let openRequest = indexedDB.open(DBNAME, drill.cacheInfo.v || 1);
                openRequest.onupgradeneeded = (e) => {
                    // 升级中（初始化中）的db触发事件，db不暴露出去的
                    let db = e.target.result;

                    // 判断是否存在表
                    // 判断是否存在
                    if (!db.objectStoreNames.contains(FILESTABLENAME)) {
                        // 建立存储对象空间
                        db.createObjectStore(FILESTABLENAME, {
                            keyPath: "path"
                        });
                    } else {
                        // 存在的话先删除
                        db.deleteObjectStore(FILESTABLENAME);

                        // 重新创建
                        db.createObjectStore(FILESTABLENAME, {
                            keyPath: "path"
                        });
                    }
                };

                // 初始成功触发的callback
                openRequest.onsuccess = (e) => {
                    // 挂载主体db
                    mainDB = e.target.result;

                    // 确认初始化
                    initDBResolve();
                }
            } else {
                reject("rubish browser no indexDB");
            }
        });

        // 加载离线或者数据库文件数据
        // 每个路径文件，要确保只加载一次
        // blobCall 用于扩展程序二次更改使用
        let cacheSource = async ({
            packData
        }) => {
            // 离线处理
            if (!offline) {
                return packData.link;
            }

            // 等待数据库初始化完成
            await isInitDB;

            // 先从数据库获取数据
            let file = await getFile(packData.path);

            if (!file) {
                // 没有的话就在线下载
                // 请求链接内容
                let p = await fetch(packData.link);

                if (p.status != 200) {
                    // 清空状态
                    // 加载失败，抛出错误
                    throw {
                        type: "cacheSource",
                        desc: "statusError",
                        status: p.status
                    };
                }

                // 生成file前的两个重要数据
                let type = p.headers.get('Content-Type').replace(/;.+/, "");
                let fileName = packData.path.replace(/.+\//, "");

                // 生成file格式
                let blob = await p.blob();

                // 生成file
                file = new File([blob], fileName, {
                    type
                })

                // 存储到数据库中
                await saveFile(packData.path, file);
            }

            // file经由cacheDress中转
            let dresser = cacheDress.get(packData.fileType);
            if (dresser) {
                file = await dresser({
                    file,
                    packData
                });
            }

            // 挂载file文件
            packData.offlineFile = file;

            // 生成url
            let tempUrl = packData.offlineUrl = URL.createObjectURL(file);

            return tempUrl;
        }


        // 获取数据方法
        const getFile = path => new Promise((res, rej) => {
            // 新建事务
            var t = mainDB.transaction([FILESTABLENAME], "readonly");
            let store = t.objectStore(FILESTABLENAME);
            let req = store.get(path);
            req.onsuccess = () => {
                res(req.result && req.result.data);
            }
            req.onerror = (e) => {
                rej();
                console.error(`error load ${path}`, e);
            }
        });

        // 保存数据
        const saveFile = (path, file) => new Promise((res, rej) => {
            // 新建事务
            var t = mainDB.transaction([FILESTABLENAME], "readwrite");
            let store = t.objectStore(FILESTABLENAME);
            let req = store.put({
                path,
                data: file
            });
            req.onsuccess = () => {
                res({
                    stat: 1
                });
                console.log(`save ${path} succeed`);
            };
            req.onerror = (e) => {
                res({
                    stat: 0
                })
                console.error(`save (${path}) error`, e);
            };
        });

        // 挂载主体方法
        Object.defineProperty(base, "main", {
            value: {
                get agent() {
                    return agent;
                },
                get load() {
                    return load;
                },
                get fixUrlObj() {
                    return fixUrlObj;
                },
                get toUrlObjs() {
                    return toUrlObjs;
                },
                get setProcessor() {
                    return setProcessor;
                }
            }
        });

        // init 
        glo.load || (glo.load = drill.load);

        // 初始化版本号
        let cScript = document.currentScript;
        !cScript && (cScript = document.querySelector(['drill-cache']));

        if (cScript) {
            let cacheVersion = cScript.getAttribute('drill-cache');
            cacheVersion && (drill.cacheInfo.v = cacheVersion);
        }

        // 判断全局是否存在变量 drill
        let oldDrill = glo.drill;

        // 定义全局drill
        Object.defineProperty(glo, 'drill', {
            get: () => drill,
            set(func) {
                if (isFunction(func)) {
                    nextTick(() => func(drill));
                } else {
                    console.error('drill type error =>', func);
                }
            }
        });

        // 执行全局的 drill函数
        oldDrill && nextTick(() => oldDrill(drill));
    })(window);
    const getRandomId = () => Math.random().toString(32).substr(2);
    const getType = value => Object.prototype.toString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
    const isFunction = val => getType(val).includes("function");
    // function getQueryVariable(variable, query) {
    //     query = query || location.search.substring(1);
    //     let reVal = null;
    //     query.split("&").some(e => {
    //         var pair = e.split("=");
    //         if (pair[0] == variable) {
    //             reVal = pair[1];
    //             return true;
    //         }
    //     });
    //     return reVal;
    // }

    let globalcss = "";

    const CURRENTS = Symbol("currentPages");
    const APPNAVIGATE = "_navigate";

    const NAVIGATEDATA = Symbol("navigateData");
    const PAGEID = Symbol("pageId");
    const PAGEOPTIONS = Symbol("pageOptions");

    let routerTarget;

    // 默认跳转型路由
    // 跳转路由，跟普通页面跳转的体验一样
    const initJumpRouter = (app) => {
        switch (app.router) {
            case "router":
            case 1:
            case "1":
            case "fast":
            case "fastback":
                break;
            default:
                return;
        }

        if (routerTarget) {
            console.warn({
                desc: "Only one app can route",
                target: app,
                routerTarget
            });
            return;
        }

        routerTarget = app;

        let nowPageState;

        if (history.state) {
            nowPageState = history.state;

            // 发现历史数据，添加回软路由
            renderHistory(nowPageState.history, app);
            // app.currents.push(...nowPageState.history);
        }

        // 附带在location上的path路径
        let in_path = location.hash.slice(1);
        if (in_path && !history.state) {
            // 当前state没有数据，但是__p参数存在，证明是外部粘贴的地址，进行地址修正
            history.replaceState(null, "", "");
            // window.location.hash = "";
            $.nextTick(() => {
                app[APPNAVIGATE]({
                    // src: decodeURIComponent(in_path)
                    src: in_path
                });
            });
        }

        app.on("navigate", (e, opt) => {
            let {
                currentPage
            } = app;
            let {
                animeParam,
                src
            } = currentPage;

            let historyObj = getHistoryObj(app);

            switch (opt.type) {
                case "to":
                    nowPageState = {
                        history: historyObj
                    }
                    // 前进url本来就记录了state，不需要重新记录
                    if (!opt._popstate_forward) {
                        history.pushState(nowPageState, "", `#${src}`);
                    }
                    break;
                case "replace":
                    nowPageState = {
                        history: historyObj
                    }
                    if (!opt._popstate_replace) {
                        history.replaceState(nowPageState, "", `#${src}`);
                    }
                    break;
                case "back":
                    // 不是通过popstate的返回，要重新修正history的路由
                    if (!opt._popstate_back) {
                        navigateBacked = 1;
                        history.go(-opt.delta);
                    }
                    break;
            }
        });

        // 返回动作是否已经执行完成
        let navigateBacked = 0;

        // 监听路由变动
        window.addEventListener("popstate", e => {
            // 对比 nowPageState 缺失是前进还是后退，修正app
            let beforeHistory = (nowPageState && nowPageState.history) || [];
            let nowHistory = (e.state && e.state.history) || [];

            if (beforeHistory.length > nowHistory.length) {
                if (navigateBacked) {
                    // 通过app.navigate返回的路由，复原 navigateBacked
                    navigateBacked = 0;
                    return;
                }
                // 页面后退
                app[APPNAVIGATE]({
                    type: "back",
                    delta: beforeHistory.length - nowHistory.length,
                    // 标识
                    _popstate_back: true
                });
            } else if (location.hash.replace(/^\#/, "") && !e.state) {
                // 直接粘贴链接进入的，重构单级路由前进
                let src = location.hash.replace(/^\#/, "");

                // 递进路由
                app.currents.push({
                    src
                });

                // 修正路由历史
                history.replaceState({
                    history: getHistoryObj(app)
                }, "", `#${src}`);

                // 修正事件
                $.nextTick(() => app.emitHandler("navigate", {
                    type: "to",
                    src,
                    _popstate_forward: true
                }));
                return;
            } else {
                // 重构多级前进路由
                // 添加到currents队列
                let fList = nowHistory.slice(-(nowHistory.length - beforeHistory.length));

                if (fList.length) {
                    // 页面前进
                    app.currents.push(...fList);

                    // 页面前进
                    let nextPage = nowHistory.slice(-1)[0];

                    // 修正事件
                    $.nextTick(() => app.emitHandler("navigate", {
                        type: "to",
                        src: nextPage.src,
                        _popstate_forward: true
                    }));
                }
                // else {
                //     // 跑到这里就有问题了，看看哪里逻辑出问题了
                //     debugger
                // }
            }

            // 修正 nowPageState
            nowPageState = e.state;
        });
    }

    // 获取待存储的历史数据
    function getHistoryObj(app) {
        let historyObj = [];
        app.currents.object.forEach((e, i) => {
            if (i == 0) {
                return;
            }
            delete e.pageId;

            historyObj.push(e);
        });
        return historyObj;
    }

    // 渲染历史页面
    function renderHistory(hisData, app) {
        // 渲染历史页面
        app.currents.push(...hisData);
        $.nextTick(() => {
            app.currentPages.forEach(page => page.style.transition = "none");
            setTimeout(() => app.currentPages.forEach(page => page.style.transition = ""), 100);
        });
    }
    // 滑动型虚拟路由，仿apple系操作
    // 获取相应class的关键有样式
    const getPageAnimeData = (animeName, defaultType) => {
        let fakeDiv = animeName;
        let appendInBody = false;
        if (!(animeName instanceof Element)) {
            appendInBody = true;
            fakeDiv = document.createElement("div");
            fakeDiv.setAttribute("o-page-anime", animeName);
            $("o-app").push(fakeDiv);
        }

        let animeData = {};
        let complteStyle = getComputedStyle(fakeDiv);

        // 提取关键元素
        ["opacity"].forEach(k => {
            animeData[k] = complteStyle[k];
        });

        // transform单独抽取
        let transformData = {
            t: defaultType || "2d"
        };
        if (complteStyle.transform && complteStyle.transform != "none") {
            if (complteStyle.transform == "matrix3d") {
                transformData.t = "3d";
            }

            // 获取关键数据，并转换为数组
            transformData.a = complteStyle.transform.replace(/matrix\((.+)\)/, "$1").split(",").map(e => parseFloat(e.trim()))
        }

        if (transformData.t == "2d" && !transformData.a) {
            // 默认2维数据就是这几个
            transformData.a = [1, 0, 0, 1, 0, 0];
        } else if (transformData.t == "3d" && !transformData.a) {
            transformData.a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }

        // 强行将2d转为3d
        if (transformData.t == "2d") {
            let old_a = transformData.a;
            transformData.t = "3d";
            transformData.a = [old_a[0], old_a[1], 0, 0, old_a[2], old_a[3], 0, 0, 0, 0, 1, 0, old_a[4], old_a[5], 0, 1];
        }

        // 删除样式
        if (appendInBody) {
            fakeDiv.remove();
        }

        // 设置transform数据
        animeData.transform = transformData;

        return animeData;
    }

    // pageParam转css样式对象
    const pageParamToStyle = pageParam => {
        let reobj = Object.assign({}, pageParam);

        // 主要转换transform
        let {
            transform
        } = pageParam;
        switch (transform.t) {
            case "2d":
                reobj.transform = `matrix(${transform.a.join(",")})`;
                break;
            case "3d":
                reobj.transform = `matrix3d(${transform.a.join(",")})`;
                break;
        }

        return reobj;
    }

    // 根据当前页状态、下一步状态和当前进度，计算当前进度pageParam数据
    const animeByPrecent = (nowParam, nextParam, precent) => {
        let pageParam = {};

        Object.keys(nowParam).forEach(k => {
            if (k === "transform") {
                // transform 单独处理
                return;
            }

            // 后缀
            let suffix = nowParam[k].replace(/[\d\.]+(\D*)/, "$1");

            // 带px的修正px
            let now = parseFloat(nowParam[k]);
            let next = parseFloat(nextParam[k]);

            pageParam[k] = (next - now) * precent + now + suffix;
        });

        let now_trans = nowParam.transform;
        let next_trans = nextParam.transform;

        if (now_trans && next_trans) {
            // 确保类型一致
            if (now_trans.t !== next_trans.t) {
                console.error("animeByPrecent transform type unequal");
                return;
            }

            let trans = pageParam.transform = {
                t: now_trans.t,
                a: []
            };

            now_trans.a.forEach((now, i) => {
                let next = next_trans.a[i];
                trans.a.push((next - now) * precent + now);
            });
        }

        return pageParam;
    }

    const getPoint = e => e.changedTouches ? e.changedTouches[0] : e.targetTouches ? e.targetTouches[0] : e.touches[0];

    const initSlideRouter = (app) => {
        if (app.router != "slide") {
            return;
        }

        if (routerTarget) {
            console.warn({
                desc: "Only one app can route",
                target: app,
                routerTarget
            });
            return;
        }

        routerTarget = app;

        // 公用软路由初始化
        fakeRouter(app);

        const LEFT = "_left" + getRandomId(),
            RIGHT = "_right" + getRandomId();
        // 在全局加入两个边缘监听元素
        $('head').push(`<style>#${LEFT},#${RIGHT}{position:fixed;z-index:10000;left:0;top:0;width:10px;height:100%;background-color:rgba(255,0,0,.0);}#${RIGHT}{left:auto;right:0;}</style>`);

        let leftPannel = $(`<div id="${LEFT}"></div>`);
        // let rightPannel = $(`<div id="${RIGHT}"></div>`);

        $("body").push(leftPannel);
        // $("body").push(rightPannel);

        // slidePage使用的页面元素
        // let prevPage, currentPage;
        // let prevPageBackParam, prevPageActiveParam, currentPageFrontParam, currentPageActiveParam;

        // 需要修正动画的页面
        let needFixPages = [];

        // 构建动画函数
        const buildSlidePage = () => {
            // 清空数据
            needFixPages.length = 0;

            if (app.currents.length <= 1) {
                // 只有首页的情况就没有滑动动画了
                return;
            }

            // 遍历所有页面，提取并设置好编译状态
            let curs = app.currents.map(e => {
                let obj = e.object;
                obj.page = e._page;
                return obj;
            });

            let lastId = curs.length - 1;
            curs.forEach((pageData, index) => {
                let {
                    page
                } = pageData;
                let {
                    animeParam
                } = page;
                let backAnimes = animeParam.back.slice();
                let currentAnimeParam, nextAnimeParam;

                // 当前页动画数据获取
                if (index == lastId) {
                    needFixPages.push({
                        currentAnimeParam: getPageAnimeData(page.animeParam.current),
                        nextAnimeParam: getPageAnimeData(page.animeParam.front),
                        page
                    });
                    return;
                } else if (index + 1 == lastId) {
                    needFixPages.push({
                        currentAnimeParam: getPageAnimeData(backAnimes[0]),
                        nextAnimeParam: getPageAnimeData(page.animeParam.current),
                        page
                    });
                } else {
                    // 相应页面前一页的动画设定
                    let nowAnime = backAnimes[lastId - 1 - index] || backAnimes.slice(-1)[0];
                    let nextAnime = backAnimes[lastId - 2 - index] || backAnimes.slice(-1)[0];

                    needFixPages.push({
                        currentAnimeParam: getPageAnimeData(nowAnime),
                        nextAnimeParam: getPageAnimeData(nextAnime),
                        page
                    });
                }
            });
        }

        // 监听滑动
        let startX, aWidth = app.width;
        // 前一个触控点，判断方向用的
        let beforePointX;
        leftPannel.on("touchstart", e => {
            e.preventDefault();

            if (!needFixPages.length) return;

            let point = getPoint(e.originalEvent);
            beforePointX = startX = point.clientX;

            needFixPages.forEach(e => {
                // 提前记忆style属性
                e._beforeStyle = e.page.attrs.style;
                // 清空动画，避免影响touchmove的操作
                e.page.style.transition = "none";
            });
        });
        let canBack = false;
        leftPannel.on("touchmove", e => {
            e.preventDefault();

            if (!needFixPages.length) return;

            let point = getPoint(e.originalEvent);
            let tx = point.clientX;

            // 获取百分比
            let percent = Math.abs(tx - startX) / aWidth;

            // 修正实时样式
            needFixPages.forEach(e => {
                let nowPagePram = animeByPrecent(e.currentAnimeParam, e.nextAnimeParam, percent);
                let nowPageStyle = pageParamToStyle(nowPagePram);
                Object.assign(e.page.style, nowPageStyle)
            });

            // 方向连贯的情况下才能下一页
            if ((tx - beforePointX) > 0 && percent > 0.1) {
                canBack = true;
            } else {
                canBack = false;
            }

            beforePointX = tx;
        });
        leftPannel.on("touchend", e => {
            e.preventDefault();

            if (!needFixPages.length) return;

            // 还原style
            needFixPages.forEach(e => {
                // 设置下一页的样式
                // let nowPagePram = animeByPrecent(e.currentAnimeParam, e.nextAnimeParam, 1);
                // let nowPageStyle = pageParamToStyle(nowPagePram);
                // console.log("nowPageStyle =>", nowPageStyle);
                // Object.assign(e.page.style, nowPageStyle, {
                //     transition: ""
                // });
                // debugger
                // 清空动画和样式，默认情况下会还原操作
                e.page.attrs.style = e._beforeStyle;
            });

            if (canBack) {
                // 直接返回页面
                app.back();
            }
        });

        app.watch("currents", e => {
            setTimeout(() => buildSlidePage(), 100);
        });

        // 启动构建
        setTimeout(() => buildSlidePage(), 100);
    }

    // 公用路由软路由初始化逻辑
    const fakeRouter = (app) => {
        const HNAME = "o-app-history-" + location.pathname;

        // 虚拟历史路由数组
        let fakeState = sessionStorage.getItem(HNAME);
        if (fakeState) {
            fakeState = JSON.parse(fakeState)
        } else {
            fakeState = {
                // 后退历史
                history: []
            };
        }
        if (fakeState.history.length) {
            // 渲染历史页面
            renderHistory(fakeState.history, app);
        }

        // 监听跳转
        app.on("navigate", (e, opt) => {
            let {
                currentPage
            } = app;
            let {
                animeParam
            } = currentPage;

            switch (opt.type) {
                case "to":
                    fakeState.history.push({
                        src: opt.src,
                        data: opt.data,
                        animeParam
                    });
                    break;
                case "replace":
                    fakeState.history.splice(-1, 1, {
                        src: opt.src,
                        data: opt.data,
                        animeParam
                    });
                    break;
                case "back":
                    fakeState.history.splice(-opt.delta);
                    break;
            }

            sessionStorage.setItem(HNAME, JSON.stringify(fakeState));
        });
    }

    drill.ext(base => {
        let {
            main
        } = base;
        $.ext(({
            renderComponent
        }) => {
            const componentBuildDefault = async ({
                defaults,
                packData,
                options,
                relativeLoad
            }) => {
                if (isFunction(options)) {
                    options = options(relativeLoad, {
                        DIR: packData.dir,
                        FILE: packData.path
                    });
                    if (options instanceof Promise) {
                        options = await options;
                    }
                }

                // 合并默认参数
                Object.assign(defaults, options);

                // 获取文件名
                let fileName = packData.path.match(/.+\/(.+)/)[1];
                fileName = fileName.replace(/\.js$/, "");

                // 置换temp
                let temp = "";
                let tempUrl = "";

                // 模板用的加载方法
                let tempLoad = relativeLoad;

                if (defaults.temp) {
                    // 判断是否有标签
                    if (/\</.test(defaults.temp)) {
                        // 拥有换行，是模板字符串
                        temp = defaults.temp;
                    } else {
                        if (defaults.temp === true) {
                            tempUrl = `./${fileName}.html`;
                        } else {
                            tempUrl = defaults.temp;
                        }

                        // 添加模板加载的地址
                        tempUrl = await relativeLoad(tempUrl + " -getLink");
                        temp = await relativeLoad(tempUrl);

                        // 重构temp用的Load方法
                        const relativeDir = tempUrl.replace(/(^.+\/).+/, "$1");
                        tempLoad = (...args) => {
                            return main.load(main.toUrlObjs(args, relativeDir));
                        }
                    }
                    // 去除备注代码
                    temp = temp.replace(/<\!--[\s\S]+?-->/g, "");

                    // 修正指定的属性值
                    // 主要修复 href 和 src 的值
                    await Promise.all(["href", "src"].map(async attr => {
                        let tagAttrsKeyReg = `[\\w\\d '"=:#@]`;
                        const reg1 = new RegExp(`<[\\w\\d\\-]+${tagAttrsKeyReg}+?${attr}=['"].+['"]${tagAttrsKeyReg}*>`, "g");
                        const reg2 = new RegExp(`<[\\w\\d\\-]+${tagAttrsKeyReg}+${attr}=['"](.+?)['"]${tagAttrsKeyReg}*>`);

                        // 修正href属性的值
                        let hrefs = temp.match(reg1);

                        if (hrefs) {
                            await Promise.all(hrefs.map(async str => {
                                // 获取href属性内的值
                                let href = str.replace(reg2, "$1");
                                try {
                                    let relativeSrc = await tempLoad(`${href} -getLink`);

                                    // 修正路径
                                    let fixStr = str.replace(new RegExp(` ${attr}=['"]${href}['"]`), ` ${attr}="${relativeSrc}"`);
                                    temp = temp.replace(str, fixStr);
                                } catch (err) {
                                    console.error(`${attr} request failed =>`, {
                                        [attr]: attr,
                                        path: err[0].path
                                    });
                                }
                            }));
                        }
                    }));

                    // 修正style内url的值
                    let styles = temp.match(/<style>[\s\S]+?<\/style>/g);
                    if (styles) {
                        await Promise.all(styles.map(async (styleStr) => {
                            let backupStyleStr = styleStr;
                            let urlArr = styleStr.match(/url\(.+?\)/g);

                            if (urlArr) {
                                await Promise.all(urlArr.map(async urlStr => {
                                    let url = urlStr.replace(/url\((.+?)\)/, "$1");

                                    try {
                                        let relativeUrl = await tempLoad(url.replace(/['"']/g, "") + " -getLink");

                                        let fixurlStr = urlStr.replace(url, relativeUrl);
                                        styleStr = styleStr.replace(urlStr, fixurlStr);
                                    } catch (err) {
                                        console.error(`style url request failed =>`, {
                                            url,
                                            path: err[0].path
                                        });
                                    }
                                }));
                            }

                            temp = temp.replace(backupStyleStr, styleStr);
                        }));
                    }

                    if (globalcss) {
                        temp = `<link rel="stylesheet" href="${globalcss}" />` + temp;
                    }
                }

                defaults.temp = temp;

                if (defaults.ready) {
                    let old_ready = defaults.ready;
                    defaults.ready = function(...args) {
                        this.ele.__xInfo.tempUrl = tempUrl;
                        return old_ready.apply(this, args);
                    }
                } else {
                    defaults.ready = function() {
                        this.ele.__xInfo.tempUrl = tempUrl;
                    }
                }
            }

            main.setProcessor("Component", async (packData, d, {
                relativeLoad
            }) => {
                let defaults = {
                    // 默认模板
                    temp: true,
                    // 与组件同域下的样式
                    hostcss: "",
                    // 组件初始化完毕时
                    ready() {},
                };

                await componentBuildDefault({
                    defaults,
                    packData,
                    options: d,
                    relativeLoad
                });

                // ready钩子
                if (defaults.hostcss) {
                    let oldReady = defaults.ready;

                    let hostcssArr = getType(defaults.hostcss) == "string" ? [defaults.hostcss] : defaults.hostcss;;

                    defaults.ready = async function(...args) {

                        // 添加hostcss
                        await Promise.all(hostcssArr.map(async hostcss => {
                            hostcss = await relativeLoad(hostcss + " -getLink");

                            // 获取元素域上的主元素
                            let root = this.ele.getRootNode();

                            // 查找是否已经存在该css
                            let targetCssEle = root.querySelector(`link[href="${hostcss}"]`)

                            if (!targetCssEle) {
                                let linkEle = $(`<link rel="stylesheet" href="${hostcss}">`);
                                if (root === document) {
                                    root.querySelector("head").appendChild(linkEle.ele);
                                } else {
                                    root.appendChild(linkEle.ele);
                                }
                            }
                        }));

                        // 执行ready方法
                        oldReady.apply(this, args);
                    }
                }

                // 注册节点
                $.register(defaults);
            });
            let opageStyle = $(`<style>o-page{display:block;}</style>`);
            $("head").push(opageStyle);

            const PAGE_PREPARING = Symbol("_preparing");
            const PAGE_PREPARING_RESOLVE = Symbol("_preparing_resolve");

            main.setProcessor("Page", async (packData, d, {
                relativeLoad
            }) => {
                let defaults = {
                    // 默认模板
                    temp: true,
                    // 监听属性函数
                    watch: {},
                    // 自有属性
                    data: {},
                    // 页面渲染完成
                    // ready() { },
                    // 页面被关闭时调用
                    // destory() { },
                    // 下面需要搭配 o-app
                    // 页面被激活时调用，搭配o-app使用
                    // onShow() { },
                    // 被放置后台时调用
                    // onHide() { },
                    // ofa app相关animeParam属性
                    // animeParam: {}
                };

                await componentBuildDefault({
                    defaults,
                    packData,
                    options: d,
                    relativeLoad
                });

                return async () => defaults;
            });

            const $SetData = $.fn.setData;

            $.register({
                tag: "o-page",
                temp: false,
                data: {
                    // 当前页面的真实地址
                    source: "",
                    // 页面是否展示，主要是在o-app内的关键属性
                    show: true,
                    // 当前页面的状态
                    status: ""
                },
                proto: {
                    get pageId() {
                        return this[PAGEID];
                    },
                    // 获取页面寄宿的app对象
                    get app() {
                        let app = this.parents("o-app");
                        if (app && app.length) {
                            app = app[0];
                        } else if (this.$host) {
                            app = this.$host.app;
                        }

                        return app;
                    },
                    set animeParam(param) {
                        this._animeParam = param;
                    },
                    get animeParam() {
                        let animeParam = this._animeParam;

                        if (!animeParam) {
                            let {
                                app
                            } = this;

                            if (app) {
                                animeParam = app.animeParam;
                            }
                        }

                        return animeParam;
                    },
                    get params() {
                        let paramsExprArr = /\?(.+)/.exec(this.src);
                        if (paramsExprArr) {
                            let obj = {};
                            let arr = paramsExprArr[1].split("&");
                            arr.forEach(str => {
                                let [k, v] = str.split("=");
                                if (k && v) {
                                    obj[k] = v;
                                }
                            });
                            return obj;
                        }
                    },
                    // 页面跳转
                    navigate(opts) {
                        let targetPage = this;

                        let app;

                        do {
                            // 修正o-page内嵌o-page找不到app的问题
                            app = targetPage.app;

                            if (!app) {
                                let hostEle = targetPage.$host;
                                if (hostEle && hostEle.is("o-page")) {
                                    targetPage = targetPage.$host;
                                } else {
                                    console.warn("this page no app =>", this);
                                    return;
                                }
                            } else {
                                // 让外层的Page进行跳转逻辑
                                if (targetPage.ele !== this.ele) {
                                    targetPage.navigate(opts);
                                    return;
                                }
                                break;
                            }

                        } while (targetPage)

                        let defs = {
                            src: ""
                        };

                        switch (getType(opts)) {
                            case "object":
                                Object.assign(defs, opts);
                                break;
                            case "string":
                                defs.src = opts;
                                break;
                        }
                        defs.self = this;

                        if (defs.type !== "back") {
                            // 当前地址的相对目录
                            let relativeDir = this.source.replace(/(.+\/).+/, "$1");

                            // 去掉后面的参数
                            let src = defs.src;

                            let obj = main.toUrlObjs([src], relativeDir)[0];
                            let path = obj.path;
                            defs.src = (obj.search ? `${path}?${obj.search}` : path);
                        }

                        return app[APPNAVIGATE](defs);
                    },
                    // 页面返回
                    back(delta = 1) {
                        return this.navigate({
                            type: "back",
                            delta
                        });
                    }
                },
                attrs: {
                    // 当前页面的链接地址
                    src: ""
                },
                watch: {
                    async src(e, val) {
                        this.attrs.oLoading = "1";

                        if (!val) {
                            return;
                        }
                        if (this.status !== "unload" && this.status !== "preparing") {
                            throw {
                                target: this,
                                desc: "o-page can't reset src"
                            };
                        }

                        // 判断是否在准备中
                        if (this[PAGE_PREPARING]) {
                            await this[PAGE_PREPARING];
                        }

                        // 加载页面模块数据
                        this.status = "loading";

                        // 相应资源地址
                        // let sourcePath = await load(val + " -r -getLink");
                        let sourcePath = await load(val + " -getLink");

                        // 设置真实地址
                        this.source = sourcePath;

                        // 修正记录信息
                        this.ele.__xInfo.scriptSrc = sourcePath;

                        let pageOpts;
                        try {
                            // pageOpts = await load(val + " -r");
                            pageOpts = await load(val);
                        } catch (e) {
                            // 错误页面
                            let errObj = e[0].descript;
                            this.status = "error";

                            renderComponent(this.ele, {
                                temp: ofa.get404({
                                    path: sourcePath,
                                    src: val
                                }),
                                attrs: [],
                                watch: {}
                            });

                            this.attrs.oLoading = null;

                            throw errObj;
                        }

                        // 页面被删除就不折腾
                        if (this.status == "destory") {
                            return;
                        }

                        // if (pageOpts.tempUrl) {
                        //     this.ele.__xInfo.tempUrl = pageOpts.tempUrl
                        // }

                        this[PAGEOPTIONS] = pageOpts;

                        // 渲染元素
                        renderComponent(this.ele, Object.assign({
                            attrs: [],
                            watch: {}
                        }, pageOpts));

                        this.attrs.oLoading = null;
                        this.status = "finish";

                        let nvdata;
                        if (this[NAVIGATEDATA]) {
                            nvdata = this[NAVIGATEDATA];
                            delete this[NAVIGATEDATA];
                        }

                        // 运行ready
                        pageOpts.ready && pageOpts.ready.call(this, {
                            data: nvdata
                        });
                        this.emit("page-ready");

                        this.watch("show", (e, show) => {
                            if (show) {
                                pageOpts.onShow && pageOpts.onShow.call(this);
                            } else {
                                pageOpts.onHide && pageOpts.onHide.call(this);
                            }
                        }, true)
                    }
                },
                ready() {
                    // 添加pageId
                    this[PAGEID] = getRandomId();
                    this.status = "unload";

                    this.on("update", e => {
                        if (e.modify.name == "setData" && e.modify.args[0] == "status" && e.modify.args[1] == "destory") {
                            e.cancel = true;
                        }
                    });
                },
                detached() {
                    this.status = "destory";
                    // this[XDATASELF].status = "destory";

                    if (this[PAGEOPTIONS]) {
                        this[PAGEOPTIONS].destory && this[PAGEOPTIONS].destory.call(this);
                        this.emit("page-destory");
                    }
                }
            });

            Object.defineProperties($.fn, {
                $page: {
                    get() {
                        let {
                            $host
                        } = this;
                        while ($host.$host) {
                            $host = $host.$host;
                        }
                        return $host;
                    }
                },
                $app: {
                    get() {
                        let {
                            $page
                        } = this;
                        if (!$page) {
                            console.warn("no app");
                            return;
                        }
                        return $page.parents("o-app")[0];
                    }
                }
            });

            // $.fn.extend({
            //     get $page() {
            //         let { $host } = this;
            //         while ($host.$host) {
            //             $host = $host.$host;
            //         }
            //         return $host;
            //     },
            //     get $app() {
            //         let { $page } = this;
            //         if (!$page) {
            //             console.warn("no app");
            //             return;
            //         }
            //         return $page.parents("o-app")[0];
            //     }
            // });
            // currents路由提前载入页面的数量
            let preloadLen = 1;

            $.register({
                tag: "o-app",
                data: {
                    // 当前页面的路由数据
                    currents: [],
                    // 默认page数据
                    _animeParam: {
                        // 后退中的page的样式
                        back: ["back"],
                        // 激活中的页面样式
                        current: "active",
                        front: "front",
                    },
                    // _appOptions: {},
                    // 是否已经launched
                    launched: false,
                    // 当前app是否隐藏
                    visibility: document.hidden ? "hide" : "show",
                    // 是否打开路由
                    router: 0,
                    // 屏幕尺寸数据
                    screen: {
                        width: "",
                        height: "",
                        // 旋转角度
                        angle: ""
                    },
                    // 元素的尺寸信息
                    rect: {
                        width: "",
                        height: ""
                    }
                },
                attrs: ["router"],
                proto: {
                    // 更新currents
                    _updateCurrents(e) {
                        let {
                            currents
                        } = this;
                        // 单个page页面数据如下
                        // let pageData = {
                        //     // 路由地址
                        //     src: "",
                        //     // 路由传递数据（非param）
                        //     data: {},
                        //     // 真正的页面元素，不存在的情况下重新创建
                        //     _page: {},
                        //     对应页面元素的id
                        //     pageId:"",
                        //     // 页面切换动画数据
                        //     animeParam: {}
                        // };

                        if (!currents.length) {
                            return;
                        }

                        // 旧的页面
                        let oldCurrents = e.old;

                        // 最后一页的id
                        let lastId = currents.length - 1;

                        // 页面修正
                        currents.forEach((pageData, index) => {
                            let {
                                animeParam,
                                data,
                                src,
                                _page
                            } = pageData;

                            // 清除下一个状态切换
                            clearTimeout(pageData._nextPageAnimeTimer);

                            let pageEle = _page;
                            // 判断是否有页面元素，没有的话添加页面元素
                            if (!pageEle) {
                                pageData._page = pageEle = $({
                                    tag: "o-page",
                                    src
                                });

                                // 设置传输数据
                                pageEle[NAVIGATEDATA] = data;

                                this.push(pageEle);
                            }

                            // unload状态全部都准备在预加载下
                            if (pageEle.status === "unload" && !pageEle._preparing) {
                                // 属于缓存进来的页面，进行等待操作
                                pageEle.status = "preparing";
                                pageEle[PAGE_PREPARING] = new Promise(res => pageEle[PAGE_PREPARING_RESOLVE] = () => {
                                    pageEle[PAGE_PREPARING_RESOLVE] = pageEle[PAGE_PREPARING] = null;
                                    res();
                                });
                            }

                            // 最后一页数据缓存
                            if (index >= (lastId - preloadLen) && pageEle[PAGE_PREPARING]) {
                                pageEle[PAGE_PREPARING_RESOLVE]();
                            }

                            // 修正pageId
                            if (!pageData.pageId) {
                                pageData.pageId = pageEle.pageId;
                            }

                            let {
                                current,
                                front,
                                back
                            } = animeParam || pageEle.animeParam;

                            if (index < lastId) {
                                // 属于前面的页面
                                // pageEle.attrs["o-page-anime"] = index + "-" + lastId;
                                pageEle.attrs["o-page-anime"] = back[lastId - 1 - index] || back.slice(-1)[0];
                                pageEle.show = false;
                            } else if (lastId == index) {
                                // 当前页不存在动画样式的情况下，就是前进式的页面
                                // 当前只有首页的情况，不需要进场动画
                                if (!pageEle.attrs["o-page-anime"] && currents.length != 1) {
                                    pageEle.attrs["o-page-anime"] = front;
                                    pageData._nextPageAnimeTimer = setTimeout(() => {
                                        pageEle.attrs["o-page-anime"] = current;
                                        pageEle.show = true;
                                    }, 50);
                                } else {
                                    // 有动画属性下，直接修正
                                    pageEle.attrs["o-page-anime"] = current;
                                    pageEle.show = true;
                                    if (this.router == "fastback") {
                                        pageEle.style['transition-duration'] = '0s';
                                        // nextTick太快了
                                        // $.nextTick(() => {
                                        setTimeout(() => {
                                            pageEle.style['transition-duration'] = '';
                                        });
                                    }
                                }
                            }

                            if (this.router == "fast") {
                                pageEle.style['transition-duration'] = '0s';
                            }
                        });

                        // 对currents去掉后的页面进行处理
                        if (oldCurrents && oldCurrents.length) {
                            // 不需要的页面
                            let unneedPageData = oldCurrents.filter(e => {
                                return !currents.find(e2 => e2.pageId === e.pageId);
                            });

                            if (unneedPageData && unneedPageData.length) {
                                let unneedPages = this.filter(e => {
                                    return !!unneedPageData.find(e2 => e2.pageId === e.pageId)
                                });

                                if (unneedPages && unneedPages.length) {
                                    // 以动画回退的方式干掉页面
                                    if (this.router == "fast" || this.router == "fastback") {
                                        // debugger
                                        unneedPages.forEach(pageEle => {
                                            pageEle.remove();
                                        });
                                    } else {
                                        unneedPages.forEach(pageEle => {
                                            let {
                                                front
                                            } = pageEle.animeParam;
                                            pageEle.attrs["o-page-anime"] = front;

                                            // 动画结束后删除
                                            let endfun = e => {
                                                pageEle.ele.removeEventListener("transitionend", endfun);
                                                pageEle.remove();
                                                endfun = null;
                                            };
                                            pageEle.ele.addEventListener("transitionend", endfun);
                                            // 时间候补确保删除
                                            setTimeout(() => endfun && endfun(), 1000);
                                        });
                                    }
                                }
                            }
                        }
                    },
                    // 页面参数，动画的数据存储对象
                    get animeParam() {
                        return this._animeParam;
                    },
                    set animeParam(val) {
                        this._animeParam = val;
                    },
                    // 选中的页面
                    get currentPage() {
                        return this.currents.slice(-1)[0]._page;
                    },
                    // // 处在路由中的页面
                    get currentPages() {
                        return this.currents.map(e => e._page);
                    },
                    // 跳转路由
                    [APPNAVIGATE](opts) {
                        let defaults = {
                            // 当前页面
                            self: "",
                            // 支持类型 to/back
                            type: "to",
                            // back返回的级别
                            delta: 1,
                            // to 跳转的类型
                            src: "",
                            // 跳转到相应pageid的页面
                            // pageid: "",
                            // 相应的page元素
                            // target: "",
                            // 自定义数据
                            data: null,
                            // 切换动画页面
                            // anime: true
                        };

                        Object.assign(defaults, opts);

                        // 跳转链接不能是协议开头的
                        if (/^.+:\/\//.test(defaults.src)) {
                            throw {
                                desc: "navigate can't use protocol path"
                            };
                        }

                        // 防止传File类的数据   
                        defaults.data && (defaults.data = JSON.parse(JSON.stringify(defaults.data)));

                        // 判断self对currents的修正
                        if (defaults.self) {
                            // 查找是否存在currents上
                            let target_id = this.currents.findIndex(e => e._page === defaults.self);
                            if (target_id > -1 && target_id < this.currents.length - 1) {
                                this.currents.splice(target_id + 1);
                            }
                        }

                        return new Promise((resolve, reject) => {
                            switch (defaults.type) {
                                case "to":
                                    this.currents.push({
                                        src: defaults.src,
                                        data: defaults.data,
                                        // _page: defaults.self
                                    });
                                    break;
                                case "replace":
                                    this.currents.splice(-1, 1, {
                                        src: defaults.src,
                                        data: defaults.data,
                                        // _page: defaults.self
                                    });
                                    break;
                                case "back":
                                    if (this.currents.length <= 1) {
                                        return;
                                    }
                                    // 干掉相应delta的页，确保必须至少剩一页
                                    if (defaults.delta == "home" || defaults.delta >= this.currents.length) {
                                        defaults.delta = this.currents.length - 1;
                                    }

                                    this.currents.splice(-defaults.delta);
                                    break;
                            }

                            $.nextTick(() => this.emitHandler("navigate", Object.assign({}, defaults)));
                        })
                    },
                    back(delta = 1) {
                        this.currentPage.back(delta);
                    },
                    navigate(...args) {
                        this.currentPage.navigate(...args);
                    },
                    // 更新尺寸信息
                    _fixSize() {
                        // 修正尺寸数据
                        this.rect.width = this.ele.clientWidth;
                        this.rect.height = this.ele.clientHeight;
                    }
                },
                ready() {
                    // 判断是否有页面，激活当前页
                    $.nextTick(() => {
                        let readyFun = () => {
                            // this[CURRENTS] = [this.$("o-page")];
                            let firstPage = this.$("o-page");

                            // 设置第一页
                            this.currents = [{
                                // 路由地址
                                src: firstPage.src,
                                // 路由传递数据（非param）
                                data: {},
                                // 真正的页面元素，不存在的情况下重新创建
                                _page: firstPage,
                                // 页面切换动画数据
                                animeParam: firstPage.animeParam,
                                // 页面id
                                pageId: firstPage.pageId
                            }];

                            // 触发事件
                            this.launched = true;

                            readyFun = null;
                        }

                        this.$("o-page") ? readyFun() : this.one("page-ready", readyFun);
                    });

                    // 检查页面状况
                    window.addEventListener("visibilitychange", e => {
                        this.visibility = document.hidden ? "hide" : "show";
                    });

                    this.watchUntil("launched").then(e => {
                        // 初始化路由
                        initSlideRouter(this);
                        initJumpRouter(this);
                    });

                    // currents 对实时性比较高，所以要同步刷新路由
                    let old_currents = [];
                    this.on("update", e => {
                        if ((e.keys.length == 1 && e.keys[0] == 'currents') || (e.keys.length === 0 && e.modify.name === 'setData' && e.modify.args[0] === "currents")) {
                            this._updateCurrents({
                                old: old_currents
                            });
                            old_currents = this.currents.object;
                        }
                    });
                    // 首次刷新路由
                    $.nextTick(() => this._updateCurrents({
                        old: []
                    }));


                    // 元素尺寸监听
                    this._fixSize();
                    if (window.ResizeObserver) {
                        const resizeObserver = new ResizeObserver(entries => {
                            this._fixSize();
                        });
                        resizeObserver.observe(this.ele);
                    } else {
                        let resizeTimer;
                        window.addEventListener("resize", e => {
                            clearTimeout(resizeTimer);
                            resizeTimer = setTimeout(() => this._fixSize(), 300);
                        });
                    }
                }
            });
        })
    });

    drill.config({
        paths: {
            // 有功能和质量要求的官方仓库
            "@ofa/": "https://kirakiray.github.io/ofa.js/lib/",
            // 无功能和质量限制的官方仓库
            "@libs/": "https://kirakiray.github.io/ofa_lib/v2/"
        }
    });

    // 配置全局变量
    const ofa = {
        set globalcss(val) {
            globalcss = val;
        },
        get globalcss() {
            return globalcss;
        },
        drill,
        $,
        get config() {
            return drill.config;
        },
        get offline() {
            return drill.offline;
        },
        set offline(val) {
            this.drill.offline = val;
        },
        get cacheInfo() {
            return this.drill.cacheInfo;
        },
        // 获取40页面的内容
        get404(e) {
            return `
            <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:300px;">
                <div style="margin-bottom:16px;width:45px;height:45px;font-size:30px;line-height:45px;border-radius:32px;text-align:center;font-weight:bold;background-color:#fb4747;color:#fff;">!</div>
                <div style="font-size:13px;color:#888;text-align:center;">
                Failed to load<br>
                path: <a style="color:#477efd;text-decoration: underline;" href="${e.path}" target="_blank">${e.path}</a> <br>
                src: <span style="color:#477efd;text-decoration: underline;">${e.src}</span>
                </div>
            </div>
            `;
        },
        v: 2009000,
        version: "2.9.0"
    };

    let oldOfa = glo.ofa;

    const runOFA = (f) => getType(f).includes("function") && f();

    Object.defineProperties(glo, {
        ofa: {
            get() {
                return ofa;
            },
            set(val) {
                runOFA(val);
            }
        }
    });

    oldOfa && runOFA(oldOfa);

})(window);
Component(async ({ load, FILE }) => {
    drill.config({
        paths: {
            "@obook/": FILE.replace(/(.+\/).+/, "$1")
        }
    });

    const { summaryToData } = await load("./util/summaryToData.js");

    await load("style/base.css", "@obook/comps/view-loading -p");

    return {
        tag: "o-book",
        attrs: {
            // 目录地址
            summary: "",
            home: ""
        },
        data: {
            // 标题
            title: "",
            // 目录相关数据
            summaryItems: {},
        },
        watch: {
            home(url) {
                if (url && !this._is_inited_home) {
                    this.shadow.$("o-app").router.unshift(`@obook/pages/reader/reader.js?path=${url}`);
                    this._is_inited_home = 1;
                    return;
                }
            },
            async summary(url) {
                if (!url) {
                    return;
                }

                if (this._inited) {
                    throw "can only be initialized once";
                }

                // 防止二次初始化
                this._inited = true;

                let summary = await fetch(this.summary).then(e => e.text());

                const summaryData = summaryToData(summary);

                // 数据赋值
                this.summaryItems = summaryData.items;
                this._links = summaryData.links;
                this.title = summaryData.title;
            }
        },
        proto: {
            clickItem(data) {
                if (data.path) {
                    // switch (this.shadow.$("o-app").router.length) {
                    //     case 0:
                    //     case 1:
                    //         // 跳转到相应地址
                    //         this.shadow.$("o-app").router.push(`@obook/pages/reader/reader.js?path=${data.path}`);
                    //         break;
                    //     default:
                    //         this.shadow.$("o-app").router.splice(-1, 1, `@obook/pages/reader/reader.js?path=${data.path}`);
                    // }
                    if (this.currentPath == data.path) {
                        return;
                    }
                    this.shadow.$("o-app").router.push(`@obook/pages/reader/reader.js?path=${data.path}`);

                    if (window.innerWidth <= 600) {
                        this.toggleLeftNav();
                    }
                }
            },
            // 当前页的path
            get currentPath() {
                const app = this.shadow.$(".article_con");
                let current = app.router.slice(-1)[0];
                return current && current._page.query.path;
            },
            toggleLeftNav() {
                if (this.shadow.$("#leftNav").width > 0) {
                    this.shadow.$("#leftNav").style.width = "0px";
                    sessionStorage.setItem("hide_left", 1);
                } else {
                    this.shadow.$("#leftNav").style.width = this.cacheLeftWidth;
                    sessionStorage.setItem("hide_left", 0);
                }
            },
            _initLeftResize() {
                // 左侧重置尺寸的逻辑-----
                const rBar = this.shadow.$(".resize_bar");

                const leftNav = this.shadow.$("#leftNav");
                const leftNavCon = this.shadow.$("#leftNavCon");


                let moveId, upId;
                rBar.on("mousedown", e => {
                    let startX = e.screenX;
                    let startWidth = leftNav.width;


                    let body = $("body");
                    body.style.userSelect = "none";
                    leftNav.style.transition = "none";

                    let maxWidth = 500;

                    if (!moveId) {
                        moveId = body.on("mousemove", e => {
                            let x = e.screenX;

                            let diffX = x - startX;

                            let width = startWidth + diffX;

                            if (width > maxWidth) {
                                width = maxWidth;
                            }

                            if (width < 200) {
                                width = 200;
                            }

                            leftNav.style.width = `${width}px`;
                            leftNavCon.style.width = `${width}px`;
                        });
                    }

                    if (!upId) {
                        upId = body.on("mouseup", e => {
                            body.off(moveId);
                            body.off(upId);
                            upId = moveId = null;
                            body.style.userSelect = "";
                            leftNav.style.transition = "";
                            this.cacheLeftWidth = leftNav.width + "px";
                        });
                    }
                });
            },
            get cacheLeftWidth() {
                let val = this._cacheLeftWidth;

                if (!val) {
                    let cache_val = localStorage.getItem("left_nav_width");
                    if (cache_val) {
                        val = cache_val;
                        this._cacheLeftWidth = val;
                    } else {
                        val = "300px";
                    }
                }

                return val;
            },
            set cacheLeftWidth(val) {
                localStorage.setItem("left_nav_width", val);
            }
        },
        ready() {
            this._initLeftResize();

            // 设置页面loading
            ofa.onState.loading = () => {
                return `<view-loading></view-loading>`;
            }

            if (sessionStorage.getItem("hide_left") == 1) {
                this.shadow.$("#leftNav").style.width = "0px";
            } else {
                this.shadow.$("#leftNav").style.width = this.cacheLeftWidth;
            }
            this.shadow.$("#leftNavCon").style.width = this.cacheLeftWidth;

            this.watchUntil(() => this.shadow.$('o-app').router.length >= 1).then(e => {
                this.shadow.$("#mainloading").loaded = 1;
            });

            // window.addEventListener("mousewheel", e => {
            //     // e.preventDefault();
            //     console.log("safari 是否触控板 => ", e.webkitDirectionInvertedFromDevice);
            // });
        }
    };
});
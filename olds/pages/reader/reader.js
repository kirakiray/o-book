Page(async ({ load }) => {
    await load("@obook/comps/o-md -p");

    return {
        data: {
            val: "i am reader",
            // 上一页和下一页的数据
            prevPageName: "",
            prevPagePath: "",
            nextPageName: "",
            nextPagePath: "",
            initMd: 0,
            mdSrc: ""
        },
        proto: {
            clickBack() {
                let prevPage = this.app.router.slice(-2)[0];
                if (prevPage.path == this.prevPagePath) {
                    this.app.router.splice(-1, 1);
                } else {
                    this.app.router.push(this.prevPagePath);
                }
                // this.replaceTo(this.prevPagePath);
            },
            clickNext() {
                this.app.router.push(this.nextPagePath);
                // this.replaceTo(this.nextPagePath);
            }
        },
        async ready() {
            let { path } = this.query;

            this.mdSrc = path;

            this.shadow.$("o-md").on("inited", e => {
                // 取消loading
                this.shadow.$("view-loading").loaded = 1;
            });

            this.shadow.$("o-md").on("linkto", e => {
                const { element, href } = e.data;

                if (/\.md$/.test(href)) {
                    let re_path = this.query.path;
                    if (re_path.includes('/')) {
                        re_path = re_path.replace(/(.*\/).+/, "$1");
                    } else {
                        re_path = "";
                    }

                    const fix_path = new URL(`${location.origin}/` + re_path + href).pathname.replace(/^\//, "");
                    this.app.router.push(`@obook/pages/reader/reader.js?path=${fix_path}`);
                }
            });

            // 查找下一篇文章的地址
            let inItem = false;
            let nextItem, prevItem;

            await this.host.watchUntil("!!_links");

            this.host._links.some(e => {
                if (e.type == "item") {
                    if (e.path == this.query.path) {
                        inItem = true;
                    } else if (inItem) {
                        nextItem = e;
                        return true;
                    } else {
                        prevItem = e;
                    }
                }
            });

            if (inItem) {
                if (nextItem && nextItem.path) {
                    // 存在下一节的，设置下一页按钮
                    this.nextPageName = nextItem.name
                    this.nextPagePath = `@obook/pages/reader/reader.js?path=${nextItem.path}`;
                }

                if (prevItem && prevItem.path) {
                    this.prevPageName = prevItem.name
                    this.prevPagePath = `@obook/pages/reader/reader.js?path=${prevItem.path}`;
                }
            }
        }
    };
});
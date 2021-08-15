Component(async ({ load, FILE }) => {
    drill.config({
        paths: {
            "@obook/": FILE.replace(/(.+\/).+/, "$1")
        }
    });

    const { summaryToData } = await load("./util/summaryToData.js");

    await load("style/base.css");

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
                    this.shadow.$("o-app").router.push(`@obook/pages/reader/reader.js?path=${url}`);
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
                    // 跳转到相应地址
                    this.shadow.$("o-app").router.push(`@obook/pages/reader/reader.js?path=${data.path}`);
                }
            },
            // 当前页的path
            get currentPath() {
                const app = this.shadow.$(".article_con");
                let current = app.router.slice(-1)[0];
                return current && current._page.query.path;
            }
        },
        ready() { }
    };
});
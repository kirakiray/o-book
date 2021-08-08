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
            // 激活中的地址
            activePath: ""
        },
        watch: {
            home(url) {
                if (url && !this._is_inited_home) {
                    this.activePath = url;
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
            },
            activePath(path) {
                if (!path) {
                    return;
                }

                // 跳转到相应地址
                this.shadow.$("o-app").router.push(`@obook/pages/reader/reader.js?path=${path}`);
            }
        },
        proto: {
            clickItem(data) {
                if (data.path) {
                    this.activePath = data.path;
                }
            }
        },
        ready() {
            // this.shadow.$(".leftNavCon").on("click", ".name", e => {
            //     let targetNav = $(e.selector);
            //     // debugger
            //     // console.log(e);
            // });
        }
    };
});
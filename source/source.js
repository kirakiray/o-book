Component(async (load, { DIR }) => {
    // 加载全局的style
    load("./style/style.css");
    ofa.globalcss = await load('./style/global.css -getLink');

    await load("./business/book-left -p");

    const { summaryToData } = await load("./util/summaryToData");

    return {
        tag: "o-book",
        attrs: {
            // summary 的地址
            summary: "",
            // home 的地址
            home: "",
            summaryData: ""
        },
        data: {
            val: "我是 o-book "
        },
        watch: {
            summary() {
                this.initSummary();
            }
        },
        proto: {
            async initSummary() {
                if (!this.summary) {
                    return;
                }

                if (this._inited) {
                    throw "can only be initialized once";
                }

                // 防止二次初始化
                this._inited = true;

                let summary = await fetch(this.summary).then(e => e.text());

                this.summaryData = summaryToData(summary);
            }
        }
    };
});
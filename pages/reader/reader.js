Page(async ({ load }) => {
    if (!window.marked) {
        // md解析器
        await load("./libs/marked.min.js");
    }

    if (!window.hljs) {
        // 代码高亮
        await load("./libs/highlight.min.js");
    }

    return {
        data: {
            val: "i am reader",
            // 上一页和下一页的数据
            prevPageName: "",
            prevPagePath: "",
            nextPageName: "",
            nextPagePath: "",
            initMd: 0,
            // 正文内容
            mdhtml: ""
        },
        proto: {
            clickBack() {
                let prevPage = this.app.router.slice(-2)[0];
                if (prevPage.path == this.prevPagePath) {
                    this.app.router.splice(-1, 1);
                } else {
                    this.app.router.push(this.prevPagePath);
                }
            }
        },
        async ready() {
            let { path } = this.query;

            let mdData = await load(location.href.replace(/(.*\/).+/, "$1") + path).then(e => {
                return e.clone().text()
            });
            let mdText = marked(mdData);

            // 修正图片资源
            {
                let rootDir = path.replace(/(.+\/).+/, "$1");
                mdText = mdText.replace(/<img.*?>/g, (imgEleStr) => {
                    let newstr = imgEleStr.replace(/src=['"](.+?)['"]/, (srcStr, matchStr) => {
                        if (/^.+:/.test(matchStr)) {
                            return srcStr;
                        } else {
                            return srcStr.replace(matchStr, rootDir + matchStr);
                        }
                    });

                    return newstr;
                });
            }

            this.mdhtml = mdText;

            // 查找下一篇文章的地址
            let inItem = false;
            let nextItem, prevItem;
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

            $.nextTick(() => {
                // 对lang内容进行高亮
                this.shadow.$(".article").all('code').forEach(e => {
                    let block = e.ele;
                    if (block.getAttribute("class")) {
                        hljs.highlightBlock(block);
                    } else {
                        Object.assign(block.style, {
                            color: "#24292e",
                            backgroundColor: "#f6f8fa"
                        });
                    }
                });

                // 修正a标签跳转路径（md文档）
                this.shadow.$(".article").all("a").forEach(aEle => {
                    let href = aEle.attr("href");
                    if (/\.md$/.test(href)) {
                        aEle.on("click", e => {
                            // 禁止默认跳转行为
                            e.preventDefault();

                            const fix_path = new URL(`${location.origin}/` + this.query.path.replace(/(.*\/).+/, "$1") + href).pathname.replace(/^\//, "");

                            this.app.router.push(`@obook/pages/reader/reader.js?path=${fix_path}`);
                        });
                    } else {
                        // 如果是链接，就新标签打开
                        aEle.attr("target", "_blank");
                    }
                });

            });
        }
    };
});
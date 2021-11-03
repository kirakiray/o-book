Component(async ({ load }) => {
    // 提前先引用先关资源
    if (!window.marked) {
        // md解析器
        await load("https://cdn.jsdelivr.net/npm/marked/marked.min.js").catch(e => {
            return load("../../libs/marked.min.js");
        })
    }

    if (!window.hljs) {
        // 代码高亮
        await load("https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/highlight.min.js").catch(e => {
            return load("../../libs/highlight.min.js");
        });
    }

    return {
        attrs: {
            // 目标readme的地址
            src: null
        },
        data: {
            // 本地数据
            value: ""
        },
        watch: {
            // 离线readme文件的地址
            async src(src) {
                if (!src) {
                    return;
                }

                // 请求资源
                // let data = await fetch(src).then(e => e.text());
                // 使用load函数可以把数据缓存起来
                let data = await load(location.href.replace(/#.+/, "").replace(/(.*\/).*/, "$1") + src).then(e => {
                    return e.clone().text()
                });

                // 设置到value
                this.value = data;
            },
            // 本地值
            value(val) {
                if (!val) {
                    return;
                }

                let mdText = (marked && marked.marked) ? marked.marked(val) : marked(val);

                const path = this.src || '';

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

                this.shadow.$("article").html = mdText;

                $.nextTick(() => {
                    // 对lang内容进行高亮
                    this.shadow.$("article").all('code').forEach(e => {
                        let block = e.ele;
                        if (block.getAttribute("class")) {
                            hljs.highlightElement(block);
                        } else {
                            Object.assign(block.style, {
                                color: "#24292e",
                                backgroundColor: "#f6f8fa"
                            });
                        }
                    });

                    // 修正a标签跳转路径（md文档）
                    this.shadow.$("article").all("a").forEach(aEle => {
                        let href = aEle.attr("href");
                        if (/\.md$/.test(href)) {
                            aEle.on("click", e => {
                                // 禁止默认跳转行为
                                e.preventDefault();

                                this.triggerHandler("linkto", {
                                    element: aEle,
                                    href
                                });

                                // const fix_path = new URL(`${location.origin}/` + this.query.path.replace(/(.*\/).+/, "$1") + href).pathname.replace(/^\//, "");

                                // this.app.router.push(`@obook/pages/reader/reader.js?path=${fix_path}`);
                            });
                        } else {
                            // 如果是链接，就新标签打开
                            aEle.attr("target", "_blank");
                        }
                    });

                    this.triggerHandler("inited");
                });
            }
        }
    };
});
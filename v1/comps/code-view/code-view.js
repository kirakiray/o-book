// 代码在线查看组件
Component(async ({ load }) => {
    if (!window.hljs) {
        // 代码高亮
        await load("https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/highlight.min.js").catch(e => {
            return load("../../libs/highlight.min.js");
        });
    }

    // 添加专用字体
    $("head").push(`
    <style>
    @font-face {
        font-family: 'iconfont-codeview';  /* Project id 2748481 */
        src: url('//at.alicdn.com/t/font_2748481_90pq5z3zig9.woff2?t=1632027936638') format('woff2'),
             url('//at.alicdn.com/t/font_2748481_90pq5z3zig9.woff?t=1632027936638') format('woff'),
             url('//at.alicdn.com/t/font_2748481_90pq5z3zig9.ttf?t=1632027936638') format('truetype');
    }
    </style>`)

    return {
        tag: "code-view",
        attrs: {
            // demo json 数据
            src: "",
            // 是否立即预览
            preview: null
        },
        data: {
            // 左侧激活的Id
            leftActiveId: "split1",
            // 所有可选资源
            sources: [],
            // 当前激活中的资源地址
            activePath: "",
            // iframe预览的地址
            frameView: "",
            // 是否有预览
            hasPreview: false,
            // 能否预览
            canPreview: false
        },
        watch: {
            async src(src) {
                if (!src) {
                    return;
                }

                let demojson = await fetch(src).then(e => e.json());

                let jsonhref = new URL(src, location.href).href;

                this.sources = demojson.sources.map(e => {
                    return {
                        name: e.replace(/.*\/(.+)/, "$1"),
                        type: e.replace(/.+\.(.+)/, "$1"),
                        path: new URL(e, jsonhref).href,
                    };
                });

                // 先载入index文件
                this.activePath = new URL(demojson.index, jsonhref).href || this.sources[0].path;

                if (demojson.view) {
                    this.hasPreview = true;
                    this.frameView = new URL(demojson.view, jsonhref).href || this.sources[0].path;
                    if (this.preview === '') {
                        this.canPreview = true;
                    }
                }
            },
            async activePath(path) {
                if (!path) {
                    return;
                }

                let content = await fetch(path).then(e => e.text());

                this.shadow.$("#content").attr("class", null);
                this.shadow.$("#content").text = content;

                hljs.highlightElement(this.shadow.$("code").ele);
            }
        },
        proto: {
            // 刷新预览
            reloadView() {
                let frameView = this.frameView;
                this.frameView = "";
                setTimeout(() => {
                    this.frameView = frameView;
                }, 100);
            },
            openNew() {
                window.open(this.frameView);
            }
        },
        ready() {
        }
    };
});
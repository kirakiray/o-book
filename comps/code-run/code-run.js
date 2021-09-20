Component(async ({ load }) => {
    if (!window.hljs) {
        // 代码高亮
        // await load("https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/highlight.min.js").catch(e => {
        //     return load("../../libs/highlight.min.js");
        // });

        await load("../../libs/highlight.min.js");
    }

    $("head").push(`
    <style>
    @font-face {
        font-family: 'iconfont-codeview';  /* Project id 2748481 */
        src: url('//at.alicdn.com/t/font_2748481_90pq5z3zig9.woff2?t=1632027936638') format('woff2'),
             url('//at.alicdn.com/t/font_2748481_90pq5z3zig9.woff?t=1632027936638') format('woff'),
             url('//at.alicdn.com/t/font_2748481_90pq5z3zig9.ttf?t=1632027936638') format('truetype');
    }
    </style>`)

    // 消除回车后的若干空格
    // 必须匹配到每一个行的个数
    function removeSpace(code) {
        // 先分行
        let all_line = code.match(/\n.+/g);

        if (all_line) {
            // 去掉空行
            all_line = all_line.filter(e => e.replace(/\n +/, ""))

            // 匹配空格
            let all_line_spaces = all_line.map(e => {
                if (e.match(/\n */)) {
                    return e.match(/\n */)[0].replace("\n", "");
                }
                return e;
            })

            // 获取最小空格数
            let min_space_num = all_line_spaces.map(e => e.length).sort((a, b) => a - b)[0];

            if (min_space_num) {
                // 去除最小数目的换行前置空格
                let reg = new RegExp(`\\n {${min_space_num}}`, "g");
                code = code.replace(reg, "\n");
            }
        }


        return code;
    }

    // 生成html文件
    function toHTMLFile(code, title = 'demo', headCode) {
        let str = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
    ${headCode || ""}
</head>

<body>
    ${code}
</body>

</html>`;

        // 生成文件
        let file = new File([str], title + '.html', {
            type: "text/html",
        });

        return file;
    }

    return {
        attrs: {
            name: "demo",
            showCode: null,
            frameHeight: ""
        },
        data: {
            // head上的代码 
            headCode: "",
            // 源代码
            code: "",
            // 根据code生成的html文件地址
            preview_url: "",
            // 首次输入的code
            firstCode: ""
        },
        watch: {
            frameHeight(h) {
                if (h) {
                    this.shadow.$("#mainFrame").style.height = h + 'px';
                }
            },
            code(code) {
                if (!code) {
                    return;
                }

                code = removeSpace(code);

                if (!this.firstCode) {
                    this.firstCode = code;
                }

                this.shadow.$("#content").text = code;
                hljs.highlightElement(this.shadow.$("code").ele);

                let file = toHTMLFile(code, this.name, this.headCode);

                URL.revokeObjectURL(this.preview_url);
                this.preview_url = URL.createObjectURL(file);

            }
        },
        proto: {
            get viewShowCode() {
                return this.showCode !== null;
            },
            set viewShowCode(bool) {
                this.showCode = bool ? "" : null;
            },
            reloadView() {
                let { preview_url } = this;

                this.preview_url = '';

                setTimeout(() => {
                    this.preview_url = preview_url;
                }, 100);
            },
            openNew() {
                window.open(this.preview_url);
            },
            changeCode(e) {
                this.code = e.target.textContent;
            },
            restoreCode() {
                this.code = this.firstCode;
            }
        },
        ready() {
            // 查找内部templte元素
            if (this[0]) {
                // 将headcode拿走
                let codehead = this[0].ele.content.querySelector("codehead");
                if (codehead) {
                    codehead.parentNode.removeChild(codehead);
                    this.headCode = codehead.innerHTML;
                }

                this.code = removeSpace(this[0].html.trim());
            }
        },
        detached() {
            URL.revokeObjectURL(this.preview_url);
        }
    };
});
define(({ load }) => {
    return {
        proto: {
            // shareHash 的 get 和 set 一定要成对应关系
            // 显示出来的hash
            get shareHash() {
                // 可设置
                return this.currentPage.src;
            },
            // 通过外部 shareHash 进入的app
            // 只会在最开始加载时候进入一次，如果没有带hash数据就不会触发这个设置
            set shareHash(hash) {
                if (hash) {
                    // 直接添加
                    this.router.push(hash);
                }
            }
        },
        ready() {
            load("@lib/router/auto.js").then(init => init(this));
            // load("http://127.0.0.1:5513/lib/router/address.js").then(init => init(this));
        }
    };
})
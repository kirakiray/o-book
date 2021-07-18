Component(async (load) => {
    return {
        tag: "ba-item",
        temp: true,
        hostcss: "./ba-item-host.css",
        attrs: {
            // 当前项的名字
            name: "",
            // 当前项的激活状态
            // null:未激活  1:目录激活   2:选项激活
            active: null,
            // 跳转地址
            path: null
        },
        watch: {
            active(e, active) {
                // if (active == 2) {
                //     // 如果设置为选项激活，就同时激活浮层的active
                //     this.parents(null, 'book-aside').forEach(ele => {
                //         ele.attrs.active = 1;
                //     });
                // }
            }
        },
        proto: {
            clickItem() {
                // 判断当前是否激活状态
                if (this.active == 2 || !this.path) {
                    return;
                }

                this.emit("clickItem");
            }
        }
    };
});
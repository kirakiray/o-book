Component(async (load) => {
    "use strict";
    await load("./ba-item -p");

    // 转换item数据为element
    function transToItem(itemData) {
        let itemEle = $(`<ba-item name="${itemData.name}"></ba-item>`);
        if (itemData.path) {
            itemEle.path = itemData.path;
        }

        itemData.childs.forEach(childData => {
            let c_ele = transToItem(childData);

            itemEle.push(c_ele);
        });

        return itemEle;
    };

    return {
        tag: "book-left",
        data: {
            // 主要的suammary数据
            sdata: {},
            // 具体的项目数据
            items: [],
            items2: [],
        },
        watch: {
            sdata(e, sdata) {
                if (!this.sdata || !this.sdata.items) {
                    return;
                }

                // console.time("bbb1");
                let frags = $(document.createDocumentFragment());
                sdata.items.forEach(e => {
                    if (e.type !== "title") {
                        let item = transToItem(e);
                        frags.push(item);
                    }
                });
                // console.timeEnd("bbb1");

                this.$list.push(frags);

                // 添加入项目数据
                this.items = this.sdata.items.object;
                this.items2 = this.sdata.items.object;
                this._items3 = this.sdata.items.object;
                // this.items._update = false;
                // this.items2._update = false;
            }
        },
        proto: {
            clickItem(data, cdata) {
                console.time("aaaa");
                let d = this.items.seek(e => e.active == 2 || e.active == 1);
                d.forEach(e => e.active = null);
                data.active = 2;
                cdata.parent.active = 1;
                console.timeEnd("aaaa");
            }
        },
        ready() {
            // this.$list.on("clickItem", e => {
            //     console.time("aaaa2");
            //     let activeTar = this.$list.all("[active]");
            //     activeTar.forEach(e => {
            //         e.active = null;
            //     });

            //     e.target.active = 2;
            //     e.target.parent.active = 1;
            //     console.timeEnd("aaaa2");
            // });

            window.testa = () => {
                console.time("aaaa3");
                // this.items[2].childs[0].active = 2;
                this.items.forEach(e => e.active = 2);
                // this.items[2].active = 1;
                console.timeEnd("aaaa3");
            };

            window.testb = () => {
                console.time("aaaa4");
                this.items2.forEach(e => e.active = 2);
                // this.items2[2].active = 1;
                console.timeEnd("aaaa4");
            };

            window.testc = () => {
                console.time("aaaa5");
                this._items3.forEach(e => e.active = 2);
                // this._items3[2].active = 1;
                console.timeEnd("aaaa5");
            };

            window.testd = () => {
                console.time("aaaa6");
                this.$list.forEach(e => {
                    e.active = 1;
                });
                console.timeEnd("aaaa6");
            }

            this._update = false;

            window.lb = this;
        }
    };
});
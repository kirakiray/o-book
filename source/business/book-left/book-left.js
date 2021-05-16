Component(async (load) => {
    return {
        tag: "book-left",
        data: {
            // 主要的suammary数据
            sdata: {},
            // 具体的项目数据
            items: []
        },
        watch: {
            sdata(e, sdata) {
                if (!this.sdata || !this.sdata.items) {
                    return;
                }

                // 添加入项目数据
                this.items = this.sdata.items.object;
            },
            // items(e, items) {
            //     if (!items.length) {
            //         return;
            //     }

            //     console.log("items => ", items);
            // }
        },
        proto: {
            clickItem(data) {
                console.time("click_time");
                let d = this.items.seek(e => e.active == 1);
                // console.timeLog("click_time");
                d.forEach(e => e.active = null);
                // this.items.seek("active == 1").forEach(e => e.active = null);
                // console.timeLog("click_time");
                data.active = 1;
                console.timeEnd("click_time");
            }
        }
    };
});
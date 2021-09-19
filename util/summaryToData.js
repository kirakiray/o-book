define(() => {
    // 获取选项名和地址
    function getNAndP(str) {
        let name = str.replace(/ *\* \[(.+)\].+/, "$1");
        let path = str.replace(/ *\* \[.+\]\((.*)\)/, "$1");

        return {
            type: "item",
            childs: [],
            name, path,
        };
    }

    // summary 转 data
    function summaryToData(summary) {
        // 先去掉注释
        summary = summary.replace(/<!--[\d\D]+?-->/g, "");

        // 将换行转回数组数据，后面根据数组数据进行转换
        let su_data = summary.split(/\n/g).filter(e => !!e);

        // 获取大标题
        let title = su_data[0];
        if (title && /^# .+/.test(title)) {
            title = title.replace(/^# (.+)/, "$1");
            su_data.splice(0, 1);
        } else {
            title = "";
        }

        // 装一级分项的数组
        const items = [];
        const links = [];

        const reData = { title, items, links };

        // 记录树状结构的父对象
        const treeParents = [];
        // 用于记录前一个项目的空格数目，纠正树状结构对象
        let beforeSpace = '';

        // 转换为items数据
        su_data.forEach(e => {
            if (/^ *\*/.test(e)) {
                // 链接类型
                // 获取前置空格数
                let spaceStr = e.replace(/( *).*/, "$1");

                // 获取数据
                let data = getNAndP(e);
                data.spaceLen = spaceStr.length;

                if (spaceStr.length === beforeSpace.length) {
                    // 一级项目
                    if (spaceStr.length === 0) {
                        items.push(data);
                    } else {
                        // 获取父级并添加到childs内
                        treeParents.slice(-2)[0].childs.push(data);
                    }

                    // 去掉最后一个
                    treeParents.splice(-1, 1);
                } else if (spaceStr.length > beforeSpace.length) {
                    // 当前项的父级项
                    let parItem = treeParents.slice(-1)[0];

                    parItem.childs.push(data);
                } else {
                    // 进行父级后退
                    let c_treeParent = treeParents.filter(e => e.spaceLen < spaceStr.length);

                    // 添加到父层
                    let par = (c_treeParent[0] && c_treeParent[0].childs) || items;

                    par.push(data);

                    treeParents.splice(0, 1000, ...c_treeParent)
                }

                // 一级列表，方便查找next
                links.push(data);

                beforeSpace = spaceStr;
                treeParents.push(data);
            } else if (/ *#+ .+/.test(e)) {
                // 标题类型
                // 获取标题内容
                let m_arr = / *#+ (.+)/.exec(e);
                let [, titleName] = m_arr;

                if (titleName) {
                    items.push({
                        type: "title",
                        text: titleName
                    });
                }
            } else if (/-+/.test(e)) {
                items.push({
                    type: "line"
                });
            }
        });

        return reData;
    }

    return { summaryToData };
});
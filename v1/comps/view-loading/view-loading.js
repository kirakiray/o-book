Component(async () => {
    // 临时全局颜色
    let gloColor = "";

    return {
        data: {
            loaded: 0,
        },
        watch: {
            loaded(e) {
                if (e) {
                    this.shadow.$(".outer_loading").one("transitionend", () => {
                        this.remove();
                    });

                    Object.assign(this.shadow.$(".outer_loading").style, {
                        transition: "all ease .3s",
                        opacity: 1
                    });

                    setTimeout(() => {
                        this.shadow.$(".outer_loading").style.opacity = 0;
                    }, 100);
                }
            }
        },
        ready() {
            let co = this.shadow.$("#colorTarget").css.color;

            if (!co) {
                co = gloColor;
            } else {
                gloColor = co;
            }

            this.shadow.$("circle").attr("stroke", co);
        }
    };
})
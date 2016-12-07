/**
 * Created by 断崖 on 2016/10/28.
 *
 * 一个滚动进度指示工具
 *
 */

define([], function () {
    if (window.ScrollProgressBar == null) {
        window.ScrollProgressBar = function (el) {

            var self = this;

            // 获取滚动信息的目标元素
            if (typeof el === "string") {
                el = document.getElementById("el");
            }
            this.targetEl = el;

            // 创建指示条元素
            this.progressbar = document.createElement("scroll_progress_bar");
            this.progressbar.style.position = "fixed";
            this.progressbar.style.top = "0";
            this.progressbar.style.left = "0";
            this.progressbar.style.width = "100%";
            this.progressbar.style.height = "2px";
            this.progressbar.style.background = "linear-gradient(to right top, red, rgb(221, 0, 0))";
            this.progressbar.style.transformOrigin = "left center";

            document.getElementsByTagName("body")[0].appendChild(this.progressbar);

            // 对目标元素的滚动事件进行监听
            if (typeof this.targetEl.attachEvent === "function") {
                this.targetEl.attachEvent("scroll", function (e) {
                    self.changeProgressbar();
                })
            } else {
                this.targetEl.addEventListener("scroll", function (e) {
                    self.changeProgressbar();
                })
            }

            // 添加原型方法
            if (typeof this.changeProgressbar != "function") {
                ScrollProgressBar.prototype.changeProgressbar = function () {
                    var scrollTop = this.targetEl.scrollTop,
                        scrollHeight = this.targetEl.scrollHeight,
                        offsetHeight = this.targetEl.offsetHeight;
                    this.progressbar.style.transform = "scaleX(" + (scrollTop / (scrollHeight - offsetHeight)).toFixed(4) + ")";
                }
            }

            this.targetEl.scrollTop += 1;
        }
    }

    return window.ScrollProgressBar;
});

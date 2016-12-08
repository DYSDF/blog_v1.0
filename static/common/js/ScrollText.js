/**
 * Created by 断崖 on 2016/12/8.
 */

define([], function () {
    function ScrollText(element, direction) {
        if (!(element instanceof HTMLElement)) throw "非DOM元素";

        // 定义变量
        direction = (direction === "v" ? "v" : (direction === "h" ? "h" : "v"));

        var lastScroll,
            curScroll,
            flag = 1;

        // 高速动画函数
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        requestAnimationFrame(function () {
            if (direction == "v") {
                element.scrollLeft += flag;
                curScroll = element.scrollLeft;
            } else {
                element.scrollTop += flag;
                curScroll = element.scrollTop;
            }

            if (curScroll == lastScroll) {
                flag *= -1;
                lastScroll = curScroll;
                window.setTimeout(arguments.callee.bind(this), 1000);
            } else {
                lastScroll = curScroll;
                requestAnimationFrame(arguments.callee.bind(this));
            }
        }.bind(this))
    }

    if (window.ScrollText) window.ScrollText = ScrollText;

    return ScrollText;
});
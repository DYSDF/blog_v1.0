/**
 * Created by 断崖 on 2016/6/28.
 */

define(["DYUtils"], function (DYUtils) {

    // 需传入参数：
    // 滚动发生元素、浮动目标元素、检测元素、边界值

    function init(scrollEv, targetEv, checkEv, top) {
        if (typeof scrollEv === "string") scrollEv = document.querySelector(scrollEv);
        if (typeof checkEv === "string") checkEv = document.querySelector(checkEv);

        DYUtils.bindEvent(scrollEv, "scroll", function () {
            var offsetTop = checkEv.getBoundingClientRect().top;
            if (top >= offsetTop) {
                targetEv.style.position = "fixed";
                targetEv.style.top = top + "px";
            } else {
                targetEv.style.position = "static";
                targetEv.style.top = "0";
            }
        });
    }

    return {
        init: init
    }
});
/**
 * Created by 断崖 on 2016/6/28.
 */

define([], function () {

    // 需传入参数：
    // 滚动发生元素、浮动目标元素、检测元素、边界值

    function addEventListener(targetEv, eventType, callbackFn) {
        if (typeof targetEv === "string") targetEv = document.getElementById(targetEv);
        if (!targetEv) return false;
        
        if (targetEv.addEventListener) {
            targetEv.addEventListener(eventType, callbackFn);
        } else {
            targetEv.attachEvent("on" + eventType, callbackFn);
        }
    }

    var init = function (scrollEv, targetEv, checkEv, top) {
        if (typeof scrollEv === "string") scrollEv = document.getElementById(scrollEv);
        if (typeof checkEv === "string") checkEv = document.getElementById(checkEv);

        addEventListener(scrollEv, "scroll", function () {
            var scrollTop = this.scrollTop,
                offsetTop = checkEv.offsetTop;
            if (scrollTop + top >= offsetTop) {
                targetEv.style.position = "fixed";
                targetEv.style.top = top + "px";
            } else {
                targetEv.style.position = "static";
                targetEv.style.top = "0";
            }
        });
    };

    return {
        "init": init
    }
});
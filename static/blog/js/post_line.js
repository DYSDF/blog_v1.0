/**
 * Created by 断崖 on 2016/6/28.
 */

require(['fixButtons'], function (fixB) {
    var scrollEv = document.getElementsByClassName("body")[0],
        checkEv = document.getElementById("post_list"),
        targetEv = document.getElementById("time_line"),
        top = 10;
    if (checkEv && targetEv) fixB.init(scrollEv, targetEv, checkEv, top);
});

/** 文章列表行为模块
 * 逻辑：
 * 1.点击月份，跳转相对应的文章列表
 * 2.点击年份，自动跳转到第一个月份
 * 3.页面滚动，自动识别所处日期，并修改时间树样式
 * 4.其他
 */
require(["jquery", "FastScroll"], function ($, FastScroll) {
    var tle = $("#time_line"),
        ple = $("#post_list"),
        ste = $("#show_time"),
        top = 6;

    function scrollToEv() {
        var year = this.dataset["year"],
            mouth = this.dataset["mouth"],
            id = year + "-" + mouth,
            scroll_top = document.getElementsByClassName("body")[0].scrollTop,
            offset_top = document.getElementById(id).getBoundingClientRect().top;

        var fastScroll = new FastScroll(document.getElementsByClassName("body")[0]);
        fastScroll.goTo(scroll_top + (offset_top - top));
    }

    function change_show_time() {
        var boundingClientRect = ple.get(0).getBoundingClientRect();
        if (boundingClientRect.top < 10) {
            var offsetLeft = boundingClientRect.left;
            var curEv = $(document.elementFromPoint(offsetLeft + 100, 10));
            var mouthEv = curEv.closest(".day_li"),
                mouth = mouthEv.data("mouth"),
                mouthIndex = mouthEv.data("mouth-index"),
                year = mouthEv.data("year"),
                yearIndex = mouthEv.data("year-index");
            if (mouth && year) {
                if (window.mouthTemp != mouth) {
                    $(ste).html(year + "-" + mouth + "-");
                    $(tle).find(".year_cur").removeClass("year_cur");
                    $(tle).find(".mouth_cur").removeClass("mouth_cur");
                    $(tle).find(">ul>li").eq(yearIndex).addClass("year_cur");
                    $(tle).find(">ul>li").eq(yearIndex).find("ul>li").eq(mouthIndex).addClass("mouth_cur");
                    window.mouthTemp = mouth;
                }
            }
        } else {
            ste.html("");
            window.mouthTemp = null;
        }
    }
    
    $(tle).find("li > ul li").on("click", scrollToEv);

    $(tle).find("> ul > li > div").on("click", function () {
        $(this).next().children(":first").trigger("click");
    });

    $(".body").on("scroll", change_show_time);
});

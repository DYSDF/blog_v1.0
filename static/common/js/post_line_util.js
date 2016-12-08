/**
 * Created by Jay-W on 2016/6/26.
 */


/** 文章列表行为模块
 * 逻辑：
 * 1.点击月份，跳转相对应的文章列表
 * 2.点击年份，自动跳转到第一个月份
 * 3.页面滚动，自动识别所处日期，并修改时间树样式
 * 4.其他
 */
define(["jquery"], function ($) {

    var tle = null,
        ple = null,
        ste = null;

    var scrollToEv = function () {
        var year = $(this).parents("li").data("year"),
            mouth = $(this).data("mouth"),
            id = "#" + year + "-" + mouth,
            offset_top = $(id).get(0).offsetTop;
        if (offset_top) {
            $('.body').animate({scrollTop: offset_top - 6}, 500);
        }
    };

    var change_show_time = function () {
        var scrollTop = $(".body").get(0).scrollTop,
            offsetTop = ple.get(0).offsetTop;
        if (scrollTop > offsetTop) {
            var offsetLeft = $(ple).get(0).offsetLeft;
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
    };

    var init = function (time_line_ev, post_list_ev, show_time_ev) {
        tle = $(time_line_ev);
        ple = $(post_list_ev);
        ste = $(show_time_ev);

        $(tle).find("li > ul li").on("click", scrollToEv);

        $(tle).find("> ul > li > div").on("click", function () {
            $(this).next().children(":first").trigger("click");
        });

        $(".body").on("scroll", change_show_time);
    };

    return {
        init: init
    };
});

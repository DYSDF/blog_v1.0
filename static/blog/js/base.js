/**
 * Created by 断崖上的风 on 2016/7/29.
 */

// 导航栏高亮
// 逻辑就是把地址当成目录，从里往外迭代，当迭代出的目录路径与某一个菜单href一致，则停止迭代，高亮菜单
require(['jquery'], function ($) {
    function highLightNavbar() {
        var location_pathname = window.location.pathname,
            location_href = window.location.href,
            menuList = $(".nav_menu li");

        // 去除高亮
        menuList.each(function (index, item, array) {
            $(item).removeClass("cur");
        });

        if (menuList.length > 0) {
            var target = null;
            var total = null;
            if (menuList.eq(0).children("a").attr("href").indexOf("http") === 0) {
                total = location_href;
            } else {
                total = location_pathname;
            }
            for (var i = total.length; i > 0; i--) {
                menuList.each(function (index, item, array) {
                    var li_href = $(item).children("a").attr("href");
                    if (li_href == total.substring(0, i)) {
                        target = item;
                    }
                });
                if (target != null) {
                    $(target).addClass("cur");
                    return;
                }
            }
        }
    }

    if ($(".nav_menu li").length > 0) {
        highLightNavbar();
    } else {
        $(document).ready(highLightNavbar);
    }
});

// 响应式菜单点击以外关闭
require(['DYUtils'], function (DYUtils) {
    DYUtils.bindEvent(document.getElementById("header_nav"), "click", DYUtils.stopBubble);
    DYUtils.bindEvent(document, "click", function (e) {
        if (document.getElementById("nav_menu_checkbox").checked) {
            document.getElementById("nav_menu_checkbox").checked = false;
            DYUtils.stopBubble(e);
            return false;
        }
    });
});

// 全局快速滚动插件
require(["DYUtils", "FastScroll"], function (DYUtils, FastScroll) {
    var fastScroll = new FastScroll(document.getElementsByClassName("body")[0]);
    fastScroll.onScroll = function (scrollTop) {
        var ev = document.getElementById("go_to_top");
        if (scrollTop > window.screen.availHeight / 2) {
            DYUtils.addClassName(ev, "show");
        } else {
            DYUtils.removeClassName(ev, "show");
        }
    };
    DYUtils.bindEvent(document, "click", function (e) {
        e = e || window.event;
        if (e.target.id == "go_to_top") fastScroll.goTop();
    })
});


// 蜘蛛网效果
require(["DYUtils", "SpiderWeb"], function (DYUtils, SpiderWeb) {
    DYUtils.DOMReady(function () {
        var spider = new SpiderWeb(document.getElementById("background_canvas"), {
            radius: 2.5,
            color: "#4c4c4c",
            count: 200,
            scale: 2,
            maxDistance: 200
        });
        spider.start();
    }, 5000)
});

// 头图动态效果
require(["DYUtils"], function (DYUtils) {
    DYUtils.DOMReady(function () {
        var hasVisited = DYUtils.getCookie("hasVisited");
        if (!hasVisited) {
            setTimeout(function () {
                DYUtils.removeClassName(DYUtils.querySelector("#container"), "init");
            }, 2000)
            DYUtils.setCookie("hasVisited", true, 30 * 60);
        }
    })
});

// 请求 hitokoto
require(["DYUtils"], function (DYUtils) {
    DYUtils.ajax({
        url: "/hitokoto?c=a",
        success: function (res) {
            json = JSON.parse(res);
            DYUtils.querySelector("#header_logo .sub_title").innerText = "『" + json.hitokoto + "』";
            DYUtils.querySelector("#header_logo .sub_title").title = "《" + json.from + "》";
        }
    })
})

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
            if (menuList.eq(0).children("a").attr("href").startsWith("http")) {
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
require(['jquery'], function () {
    $("#header_nav").on("click", function (e) {
        e.stopPropagation();
    });

    $("body").on("click", function () {
        if ($("#nav_menu_checkbox").get(0).checked) {
            $("#nav_menu_checkbox").get(0).checked = false;
            return false;
        }
    })
});

// 全局快速滚动插件
require(["FastScroll"], function (FastScroll) {
    var fastScroll = new FastScroll(document.getElementsByClassName("body")[0]);
    fastScroll.onScroll = function (scrollTop) {
        var ev = document.getElementById("go_to_top"),
            className = ev.className;
        if (scrollTop > window.screen.availHeight / 2) {
            ev.className = className.replace(new RegExp("show"), " ").trim() + " show";
        } else {
            ev.className = className.replace(new RegExp("show"), " ").trim();
        }
    };
    document.addEventListener("click", function (e) {
        e = e || window.event;
        if (e.target.id != "go_to_top") return false;
        fastScroll.goTop();
    })
});

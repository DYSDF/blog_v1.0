/**
 * Created by 断崖 on 2016/6/28.
 */

require(['jquery', 'post_line_util'], function ($, unit) {
    if ($("#header_nav").get(0).offsetTop > 0) {
        unit.init($("#time_line"), $("#post_list"), $("#show_time"))
    }
});


require(['fixButtons'], function (fixB) {
    var scrollEv = document.getElementsByClassName("body")[0],
        checkEv = document.getElementById("post_list"),
        targetEv = document.getElementById("time_line"),
        top = 10;
    if (checkEv && targetEv)
        fixB.init(scrollEv, targetEv, checkEv, top);
});

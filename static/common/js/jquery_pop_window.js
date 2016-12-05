/**
 * Created by 断崖 on 2016/8/26.
 */


(function ($) {
    $.fn.window = function (method, style) {
        if(method == "init"){
            var content = $("<div class='content'></div>");
            content.html($(this).html());
            $(this).html("");
            $(this).append(content);

            if($(this).data("title") != null && $(this).data("title") != ""){
                var title = $("<div class='title'></div>");
                title.text($(this).data("title"));
                title.css({
                    "line-height": "30px",
                    "padding": "0 10px",
                    "background-color": "#4c4c4c",
                    "color": "white",
                    "border-bottom": "6px solid #169fe6",
                    "cursor": "move"
                });

                var that = this;
                title.on("mousedown", function (e) {
                    var old_clientX = e.clientX,
                        old_clientY = e.clientY;
                    title.on("mousemove", function (e) {
                        $(that).css("transform", function () {
                            return "translate(" + (e.clientX - old_clientX) + "px, " + (e.clientY - old_clientY) + "px)";
                        })
                    }).on("mouseup", function (e) {
                        $(this).unbind("mousemove mouseup");
                        $(that).css({
                            "top": "+=" + (e.clientY - old_clientY),
                            "left": "+=" + (e.clientX - old_clientX)
                        }).css("transform", "");
                    })
                });

                title.insertBefore(content);
            }

            var default_css = {
                "height": "auto",
                "width": "auto",
                "text-align": "center"
            };
            if(style != null){
                $.extend(default_css, style);
            }
            $(this).css(default_css);
            $(this).css({
                "position": "absolute",
                "top": "45%",
                "left": "50%",
                "border": "1px solid #909090",
                "background-color": "white",
                "box-shadow": "0 0 8px #ccc",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                "z-index": "1000"
            });
            var offset_width = $(this).outerWidth(),
                offset_height = $(this).outerHeight();
            $(this).css({
                "margin-left": - offset_width / 2,
                "margin-top": - offset_height / 2
            });

            if($("#window_mask").length == 0){
                var mask = $("<div id='window_mask'></div>");
                mask.css({
                    "position": "absolute",
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "left": "0",
                    "background": "#d0d0d0",
                    "opacity": "0.4",
                    "display": "none",
                    "z-index": "999"
                });
                $("body").append(mask);
            }

            var animate = $("<style>" +
                "@keyframes windowShow {" +
                    "0% { " +
                    "-webkit-transform: scale(0); " +
                    "-moz-transform: scale(0); " +
                    "-ms-transform: scale(0); " +
                    "-o-transform: scale(0);" +
                    "transform: scale(0);" +
                    "opacity: 0;" +
                    "visibility: hidden" +
                    "}" +
                    "90% {" +
                    "-webkit-transform: scale(1.1); " +
                    "-moz-transform: scale(1.1); " +
                    "-ms-transform: scale(1.1); " +
                    "-o-transform: scale(1.1);" +
                    "transform: scale(1.1);" +
                    "opacity: 0.9;" +
                    "}" +
                    "100% { " +
                    "-webkit-transform: scale(1); " +
                    "-moz-transform: scale(1); " +
                    "-ms-transform: scale(1); " +
                    "-o-transform: scale(1);" +
                    "transform: scale(1);" +
                    "opacity: 1;" +
                    "visibility: visible" +
                    "}" +
                "}" +
                "@keyframes windowHide {" +
                    "0% { " +
                    "-webkit-transform: scale(1); " +
                    "-moz-transform: scale(1); " +
                    "-ms-transform: scale(1); " +
                    "-o-transform: scale(1);" +
                    "transform: scale(1);" +
                    "opacity: 1;" +
                    "visibility: visible" +
                    "}" +
                    "10% {" +
                    "-webkit-transform: scale(1.1); " +
                    "-moz-transform: scale(1.1); " +
                    "-ms-transform: scale(1.1); " +
                    "-o-transform: scale(1.1);" +
                    "transform: scale(1.1);" +
                    "opacity: 0.9;" +
                    "}" +
                    "100% { " +
                    "-webkit-transform: scale(0); " +
                    "-moz-transform: scale(0); " +
                    "-ms-transform: scale(0); " +
                    "-o-transform: scale(0);" +
                    "transform: scale(0);" +
                    "opacity: 0;" +
                    "visibility: hidden" +
                    "}" +
                "}" +
                ".window_show {" +
                    "animation: windowShow 0.4s;" +
                    // "animation-fill-mode: forwards;" +
                "}" +
                ".window_hide {" +
                    "animation: windowHide 0.2s;" +
                    // "animation-fill-mode: backwards;" +
                "}" +
                "</style>");
            $("head").append(animate);
        }

        if(method == "open"){
            var window = this;
            $("#window_mask").show().on("click", function () {
                $(window).window("close");
            });
            $(this).css("visibility", "visible").removeClass("window_hide").addClass("window_show").window("center");
        }

        if(method == "close"){
            $("#window_mask").hide().unbind("click");
            $(this).css("visibility", "hidden").removeClass("window_show").addClass("window_hide");
        }

        if(method == "center"){
            offset_width = $(this).outerWidth();
            offset_height = $(this).outerHeight();
            $(this).css({
                "top": "45%",
                "left": "50%",
                "margin-left": - offset_width / 2,
                "margin-top": - offset_height / 2
            });
        }
    }
})(jQuery);

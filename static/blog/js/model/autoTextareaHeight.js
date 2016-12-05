/**
 * Created by 断崖 on 2016/8/19.
 */

/**
 * Textarea高度自适应jQuery插件
 * 可传入参数minHeight、maxHeight
 */

(function ($) {
    $.fn.autoTextareaHeight = function (minH, maxH) {
        var minHeight = minH || 20,
            padding = parseInt($(this).css("paddingTop")) + parseInt($(this).css("paddingBottom")),
            scrollHeight,
            scrollTop,
            curHeight,
            firstRun = true;

        // 初始化
        $(this).css({
            "min-height": minHeight,
            "height": minHeight,
            "resize": "none"
        });

        function _change() {
            // 当文本域没有变化时，跳出处理
            if(this._length == this.value.length){
                return ;
            }
            this._length = this.value.length;

            scrollTop = $(".body").scrollTop();
            curHeight = $(this).height();
            // 当实际高度超出最小值，计算并改变高度
            $(this).css("height", minHeight);
            scrollHeight = $(this).prop("scrollHeight");
            if(maxH && scrollHeight > maxH){
                $(this).css({
                    "height": maxH,
                    "overflowY": "auto"
                })
            } else if(scrollHeight >= minHeight){
                $(this).css({
                    "height": function () {
                        return scrollHeight + padding;
                    },
                    "overflowY": "hidden"
                });
                if(firstRun){
                    firstRun = null;
                    return ;
                }
                $(".body").scrollTop(scrollTop + $(this).height() - curHeight);
            }
        }

        // 监听事件
        $(this).on("propertychange input focus", _change);
        _change.call(this.get(0));
    }
})(jQuery);
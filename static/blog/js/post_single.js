/**
 * Created by 断崖 on 2016/6/28.
 */

// 动态加载代码高亮脚本
require(["jquery", "highlight"], function ($) {
    
    // highlight
    $("pre code").each(function(index, ev){
        var node = document.createElement("link");
        node.rel = "stylesheet";
        node.href = "/static/ckeditor/plugins/codesnippet/lib/highlight/styles/monokai_sublime.css";
        document.head.appendChild(node);

        window.hljs.highlightBlock(ev);
    });
    
    // // synxhighlight
    // var shType = $("pre").map(function () {
    //     console.log($(this).attr("class"));
    //     return $(this).attr("class");
    // });
    // if(shType){
    //     var hash = {}, temp = [];
    //     for(var i = 0; i < shType.length; i++){
    //         if(!hash[shType[i]]){
    //             hash[shType[i]] = true;
    //             temp.push(shType[i].replace(":", "_"));
    //         }
    //     }
    //     require(["shCore"], function () {
    //         var node = document.createElement("link");
    //         node.rel = "stylesheet";
    //         node.href = "/static/highlighter/styles/shCoreDefault.css";
    //         document.head.appendChild(node);
    //         require(temp, function () {
    //             if(SyntaxHighlighter){
    //                 SyntaxHighlighter.highlight();
    //             }
    //         });
    //     });
    // }
});


// 评论框脚本
require(["jquery"], function ($) {
    function showTips(str, fn) {
        $("#comment_form_tips").text(str)
            .animate({ "max-height": "80px"}, 600);
        setTimeout(function () {
            $("#comment_form_tips").animate({ "max-height": "0"}, 600, fn);
        }, 3000)
    }

    // 移动提交框
    window.commentReply = function (ev, replyId) {
        $("#comment_form [name='reply_to']").val(replyId);
        var target = $(ev).closest(".comment_body");
        $("#respond_post").appendTo(target);
        $("#cancel_comment_reply_link").show();
    };

    // 复位提交框
    window.cancelReply = function () {
        $("#comment_form [name='reply_to']").val("");
        $("#respond_post").appendTo("#comments");
        $("#cancel_comment_reply_link").hide();
    };

    // 提交时运行函数
    $("#comment_form").on("submit", function (e) {
        var data = $("#comment_form").serialize();
        $.ajax({
            url: $("#comment_form").attr("action"),
            method: "post",
            data: data,
            success: function (data) {
                if(data.success){
                    $("#comment_form").get(0).reset();
                    showTips("评论成功！感谢回复~", function () {
                        window.location.reload();
                    });
                } else {
                    showTips(data.msg);
                }
            },
            error: function () {
                showTips("没有网络？？？   你忘记交网费了？！");
            }
        });
        return false;
    });

    // Ctrl + Enter 提交表单
    $(document).on("keyup", function (e) {
        if(e.ctrlKey && e.keyCode == 13){
            $("#comment_form").get(0).scrollIntoView(true);
            $("#comment_form button").trigger("click");
        }
    });

    // 加载textarea高度自适应脚本
    require(["jquery", "autoTextAreaHeight"], function () {
        $("#comment_form textarea").each(function (index, ev) {
            $(this).autoTextareaHeight(150);
        });
    });
});

// 滚动条进度插件
require(['ScrollProgressBar'], function (SPB) {
    new ScrollProgressBar(document.getElementsByClassName("body")[0]);
});

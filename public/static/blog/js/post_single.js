require(["jquery","highlight"],function(a){a("pre code").each(function(b,d){var c=document.createElement("link");c.rel="stylesheet";c.href="/static/ckeditor/plugins/codesnippet/lib/highlight/styles/monokai_sublime.css";document.head.appendChild(c);window.hljs.highlightBlock(d)})});require(["jquery","DYUtils"],function(c,a){function b(e,d){c("#comment_form_tips").text(e).animate({"max-height":"80px"},600);setTimeout(function(){c("#comment_form_tips").animate({"max-height":"0"},600,d)},3000)}window.commentReply=function(e,d){c("#comment_form [name='reply_to']").val(d);var f=c(e).closest(".comment_body");c("#respond_post").appendTo(f);c("#cancel_comment_reply_link").show()};window.cancelReply=function(){c("#comment_form [name='reply_to']").val("");c("#respond_post").appendTo("#comments");c("#cancel_comment_reply_link").hide()};c("#comment_form").on("submit",function(f){var d=c("#comment_form").serialize();a.ajax({url:c("#comment_form").attr("action"),method:"post",data:d,success:function(e){e=JSON.parse(e);if(e.success){c("#comment_form").get(0).reset();b("评论成功！感谢回复~",function(){window.location.reload()})}else{b(e.result)}},error:function(){b("没有网络？？？   你忘记交网费了？！")}});return false});a.bindEvent(document,"keyup",function(d){if(d.ctrlKey&&d.keyCode==13){c("#comment_form").get(0).scrollIntoView(true);c("#comment_form button").trigger("click")}});require(["jquery","autoTextAreaHeight"],function(){c("#comment_form textarea").each(function(d,e){c(this).autoTextareaHeight(150)})})});require(["ScrollProgressBar"],function(a){new a(document.getElementsByClassName("body")[0])});
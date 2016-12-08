/**
 * Created by 断崖 on 2016/6/28.
 */

require.config({
    baseUrl: "/static",
    shim: {
        "jCookie": ["jquery"]
    },
    paths: {
        // jQuery
        "jquery": "jQuery/jquery.min",
        "jCookie": "jQuery/jquery.cookie",

        // 自定义模块
        "ajaxArticle": "blog/js/model/ajaxArticles",

        // 保持元素悬浮
        "fixButtons": "blog/js/model/fix_buttons",

        // 滚动条进度插件
        "ScrollProgressBar": "blog/js/model/ScrollProgressBar",

        // post_line页面工具集
        "post_line_util": "blog/js/model/post_line_util",

        
        // 代码高亮方案
        // "shCore": "highlighter/scripts/shCore",
        // "brush_css;": "highlighter/scripts/shBrushCss",
        // "brush_js;": "highlighter/scripts/shBrushJScript",
        // "brush_py;": "highlighter/scripts/shBrushPython",
        // "brush_xml;": "highlighter/scripts/shBrushXml",
        // "brush_html;": "highlighter/scripts/shBrushXml",
        // "brush_sh;": "highlighter/scripts/shBrushBash",

        "highlight": "ckeditor/plugins/codesnippet/lib/highlight/highlight.pack",

        // TextArea高度自适应插件
        "autoTextAreaHeight": "blog/js/model/autoTextareaHeight",

        // 快速滚动插件
        "FastScroll": "blog/js/model/FastScroll",
    }
});

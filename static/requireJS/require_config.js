/**
 * Created by 断崖 on 2016/6/28.
 */

require.config({
    baseUrl: "/static",
    shim: {
        "jCookie": ["jquery"]
    },
    paths: {
        // 自定义工具集
        DYUtils: "common/js/Utils",

        // jQuery
        "jquery": "jQuery/jquery.min",
        "jCookie": "jQuery/jquery.cookie",

        // 保持元素悬浮
        "fixButtons": "common/js/fix_buttons",

        // 滚动条进度插件
        "ScrollProgressBar": "common/js/ScrollProgressBar",

        // post_line页面工具集
        "post_line_util": "common/js/post_line_util",

        
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
        "autoTextAreaHeight": "common/js/autoTextareaHeight",

        // 快速滚动插件
        "FastScroll": "common/js/FastScroll",

        // 简易音乐播放器
        "SimpleMusicPlayer": "common/js/MusicPlayer",

        // 文字滚动插件
        "ScrollText": "common/js/ScrollText"
    }
});

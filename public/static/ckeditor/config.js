/**
 * Created by Jay-W on 2016/8/13.
 */


CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';

    config.skin = 'moono';
    config.language = 'zh-cn';
    config.toolbarCanCollapse = false;
    config.toolbarStartupExpanded = true;
    config.allowedContent = true;
    config.filebrowserUploadUrl = '/article/upload/img/?csrfmiddlewaretoken=' + CKEDITOR.tools.getCookie("csrftoken");
    config.image_previewText = '无图片预览';
    config.font_names = '宋体;黑体;楷体_GB2312;Arial;Comic Sans MS;Courier New;Tahoma;Times New Roman;Verdana';
    config.removeDialogTabs = 'image:advanced;link:advanced';
    config.removePlugins = 'elementspath';
    config.resize_enabled = false;
    config.tabSpaces = 4;

    // CodeSnippet 配置
    config.codeSnippet_theme = 'monokai_sublime';

    // PBCK Code 配置(暂时无用)
    // config.pb_theme = 'monokai';
};
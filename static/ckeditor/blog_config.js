/**
 * Created by Jay-W on 2016/8/13.
 */

$(function(){

    var config = {
        
        'extraPlugins': 'widget,lineutils,imageuploader,codesnippet',
        
        'toolbar': [
            ['Source', 'Preview'],
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
            ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
            // ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
            ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'BidiLtr', 'BidiRtl', '-', 'Blockquote'],
            ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink', 'Anchor'],
            ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'],
            ['Styles', 'Format', 'Font', 'FontSize'],
            ['TextColor', 'BGColor'],
            ['Maximize', 'ShowBlocks', '-', 'CodeSnippet']
        ],
        'width': '100%',
        'height': 400
        // 'entities': False,
        // 'htmlEncodeOutput': False,
    };

    CKEDITOR.replace("id_content", config);
});

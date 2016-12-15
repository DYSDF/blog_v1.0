/**
 * Created by Jay-W on 2016/8/13.
 */

KindEditor.ready(function(K) {
    window.editor = K.create('#id_content',{

        // 批量上传限制
        imageSizeLimit: "10M",
        imageFileTypes: "*.jpg;*.gif;*.png",
        imageUploadLimit: 50,

        // 修改编辑器宽、高度
        width:'100%',
        height:'400px'
    });
});

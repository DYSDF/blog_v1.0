/**
 * Created by 断崖 on 2016/8/25.
 */

$(function () {
    $("#upload_type_select").window("init", {
        "text-align": "center"
    });

    $("#upload_img_form").window("init");

    $("#upload_img_form form").on("submit", function () {
        var data = new FormData(this);
        $.ajax({
            url: '/filemanage/add',
            type: 'POST',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success: function (json) {
                if (json.success) {
                    alert("上传成功！");
                    $("#upload_img_form form").get(0).reset();
                    $("#upload_img_form").window("close");
                } else {
                    alert("上传失败...");
                }
            }
        });
        return false;
    });

    $("#upload_file_form").window("init");
    $("#upload_file_form form").on("submit", function () {
        var data = new FormData(this);
        $.ajax({
            url: '/filemanage/add',
            type: 'POST',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success: function (json) {
                if (json.success) {
                    alert("上传成功！");
                    $("#upload_file_form form").get(0).reset();
                    $("#upload_file_form").window("close");
                } else {
                    alert("上传失败...");
                }
            }
        });
        return false;
    });
});


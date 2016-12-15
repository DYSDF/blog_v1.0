/**
 * Created by 断崖 on 2016/9/7.
 */

//字符串格式化输出
String.prototype.format = Overload({
    "array" : function(params){
        var reg = /{(\d+)}/gm;
        return this.replace(reg,function(match,name){
            return params[~~name];
        });
    },
    "object" : function(param){
        var reg = /{([^{}]+)}/gm;
        return this.replace(reg,function(match,name){
            return param[name];
        });
    }
});

// 文件管理数据库操作
(function ($) {
    // 当前目录
    var curPath = "/";

    // 连接数据库
    var database = null;
    var request = window.indexedDB.open("FileSystem", 1);
    request.onsuccess = function () {
        database = request.result;
        refreshNavBar(curPath);
        $(document).ready(function () {
            refreshNavBar(curPath);
        });
    };
    request.onerror = function (e) {
        alert("打开数据库失败");
    };
    request.onupgradeneeded = function () {
        // 数据库初始化
        database = request.result;
        var store = database.createObjectStore("fileList", {"keyPath": "path"});
        store.createIndex('parent_path', 'parent_path', {"keyPath": "path"});
    };

    // 获取文件子项渲染模板
    function getFileItemTemplate(file) {
        // 文件元素模板
        var htmlStr = '<div class="grid_view_item" data-name="{server_filename}" data-path="{path}">\
                            <input id="{path}" class="file_checkbox" type="checkbox" style="display: none">\
                            <label class="checkbox" for="{path}">\
                                <i class="icon icon-check"></i>\
                                <i class="icon icon-check-empty"></i>\
                            </label>\
                            <div class="file_icon icon_folder_large">\
                                <img src="" alt="" class="thumb">\
                            </div>\
                            <div class="file_name">\
                                <a href="">{server_filename}</a>\
                            </div>\
                        </div>'.format(file);
        return htmlStr;
        // $(".grid_view_container").append(template);
    }

    // 导航
    function refreshNavBar(path) {
        var self = arguments.callee;

        curPath = path;

        var nav_li = path.split("/").filter(function (item) {
            return !!item;
        });

        var parentNode = $(".list_dir_info .list_dir");
        parentNode.html("");

        var firstNode = $("<li data-path='/'><a href='javascript:;'>全部文件</a>&nbsp;</li>");
        firstNode.click(function () {
            self($(this).data("path"));
        });
        parentNode.append(firstNode);

        nav_li.map(function (item, index) {
            var path = nav_li.slice(0,index + 1);
            var node = $("<li data-path='/" + path.join("/") + "/'>&gt;&nbsp;<a href='javascript:;'>" + item + "</a>&nbsp;</li>");
            node.click(function () {
                self($(this).data("path"));
            });
            parentNode.append(node);
        });

        refreshGridview();
    }

    // 构建资源列表
    function refreshGridview() {
        var transaction = database.transaction(["fileList"], "readonly"),
            store = transaction.objectStore("fileList"),
            index = store.index("parent_path");

        var request = index.openCursor(IDBKeyRange.only(curPath)),
            htmlStr = "",
            count = 0;
        request.onerror = function (event) {
            alert("发生错误：" + request.error);
        };
        request.onsuccess = function (event) {
            //创建一个游标
            var cursor = event.target.result;
            //根据游标判断是否有数据
            if (cursor) {
                htmlStr += getFileItemTemplate(cursor.value);
                // message += "{0}=={1}".format([file.server_filename,file.path]);

                //调用cursor.continue()方法访问下一条数据
                //当游标到达下一条数据时，onsuccess事件会再一次触发
                ++count;
                cursor.continue();
            } else {
                // 如果一个结果也没有，说明游标到底了
                $(".grid_view_container").html(htmlStr);
                $(".list_dir_info .list_dir_tips").html("共 " + count + " 个");
                // justify布局需要
                for(var i = 0; i < 10; i++){
                    $(".grid_view_container").append('<div class="grid_view_item" style="height: 0; margin: 0 10px"></div> ');
                }
            }
        }
    }

    // 新建文件夹
    function createFolder(folder) {
        var transaction = database.transaction(["fileList"], "readwrite");
        var objectStore = transaction.objectStore("fileList");
        var request = objectStore.put(folder);
        request.onerror = function() {
            alert("发生错误：" + request.error);
        };
        request.onsuccess = function() {
            refreshGridview();
        };
    }

    // 文件删除处理
    function deleteItem(path) {
        var self = arguments.callee;
        var transaction = database.transaction(["fileList"], "readwrite");
        var objectStore = transaction.objectStore("fileList"),
            index = objectStore.index("parent_path");

        var request = objectStore.delete(path);
        request.onerror = function () {
            alert("删除失败");
        };
        request.onsuccess = refreshGridview;

        // 迭代删除目录及文件
        request = index.openCursor(IDBKeyRange.only(path));
        request.onerror = function (event) {
            alert("发生错误：" + request.error);
        };
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if(cursor.value.path){
                    self(cursor.value.path);
                }
                cursor.continue();
            }
        }
    }


    // 绑定按钮事件
    $(function () {
        // 文件夹点击进入
        $(".grid_view_container").on("click", ".file_icon", function (e) {
            refreshNavBar($(this).parent(".grid_view_item").attr("data-path"));
        });

        // 新建文件夹
        $("#newFolderBtn").click(function () {
            var newName = window.prompt("请输入文件夹名称", "新建文件夹");
            if(newName){
                if($(".grid_view_container div[data-name='" + newName + "']").length > 0){
                    var reNameCount = 1;
                    while ($(".grid_view_container div[data-name='" + (newName + "(" + reNameCount + ")") + "']").length > 0){
                        // alert("文件夹已经存在！");
                        // return ;
                        reNameCount += 1;
                    }
                    newName += "(" + reNameCount + ")";
                }

                var nowSeconds = parseInt(Date.now() / 1000),
                    testData = {
                        "isdir": 1,
                        "local_ctime": nowSeconds,
                        "local_mtime": nowSeconds,
                        "md5": "",
                        "parent_path": curPath,
                        "path": curPath + newName + "/",
                        "server_ctime": nowSeconds,
                        "server_mtime": nowSeconds,
                        "server_filename": newName,
                        "size": 0
                    };
                createFolder(testData);
            }
        });

        // 删除按钮
        $("#deleteFileBtn").click(function () {
            var r = window.confirm("确定删除所选文件？");
            if(r){
                $(".file_checkbox:checked").each(function (index, item) {
                    deleteItem(item.id);
                });
                $(".grid_view_container").removeClass("grid_view_select");
                $("#deleteFileBtn").hide();
            }
        });

        // 勾选文件时显示/隐藏按钮
        $(".grid_view_container").on("click", ".checkbox", function (e) {
            setTimeout(function () {
                var checkboxList = $(".file_checkbox:checked");
                if(checkboxList.length == 0){
                    $(".grid_view_container").removeClass("grid_view_select");
                    $("#deleteFileBtn").hide();
                } else {
                    $(".grid_view_container").addClass("grid_view_select");
                    $("#deleteFileBtn").show();
                }
            }, 0);
        })
    });
})(jQuery);
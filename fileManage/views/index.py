# coding=utf-8
import json
import os
import uuid

from django.contrib.auth.decorators import permission_required
from django.template import loader
from django.http import HttpResponse, HttpResponseNotFound, QueryDict
from libs.FileManage.FileStorage import FileStorage, ImageStorage
import fileManage.views.utils as utils
from siteRoot import settings


def index(request, **kwargs):
    return HttpResponse(loader.render_to_string(template_name="fileManage/index.html", request=request))


@permission_required("filemanage.add_images", login_url='/admin/login/')
def upload(request, **kwargs):
    query = QueryDict("").copy()
    query.update(request.POST)

    file_type = query.get("type", "")
    file_dir = query.get("path", "/")
    file_list = request.FILES.getlist("files")

    result = utils.get_bean_result()
    if len(file_list) == 0:
        result.update({
            "success": False,
            "error": "上传文件为空"
        })
        return HttpResponse(json.dumps(result), content_type="application/json")

    AccessObj = {}
    if file_type == "image":
        try:
            for image in file_list:
                if query.get("need_origin", None):
                    storage = ImageStorage(path=os.path.normpath(file_dir + os.path.sep + "origin"))
                    origin = storage.save(image.name, image)
                    AccessObj.update({
                        "origin": storage.url(origin)
                    })
                if query.get("need_thumb", None):
                    storage = ImageStorage(path=os.path.normpath(file_dir + os.path.sep + "thumb"), re_size=(600, None))
                    thumb = storage.save(image.name, image)
                    AccessObj.update({
                        "thumb": storage.url(thumb)
                    })
            result.update({
                "success": True,
                "result": AccessObj
            })
        except Exception as e:
            result.update({
                "success": False,
                "error": e.message
            })

    elif file_type == "file":
        try:
            for file in file_list:
                storage = FileStorage(path=os.path.normpath(file_dir), not_rename=True, max_size=(20 * 1024 * 1024))
                fileName = storage.save(file.name, file)
                AccessObj.update({
                    "url": storage.url(fileName)
                })
            result.update({
                "success": True,
                "result": AccessObj
            })
        except Exception as e:
            result.update({
                "success": False,
                "error": e.message
            })

    return HttpResponse(json.dumps(result), content_type="application/json")

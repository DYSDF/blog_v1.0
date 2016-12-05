# coding: utf-8
import json

from django.http import HttpResponse, QueryDict
from libs.FileManage.FileStorage import FileStorage, ImageStorage


def upload_img(request, **kwargs):
    fileObj = request.FILES.get("upload", None)

    if fileObj is None:
        return HttpResponse("<script>window.alert('上传文件为空！')</script>")

    storage = ImageStorage(path="/thumb", url="/thumb", re_size=(600, None))
    url = storage.url(storage.save(fileObj.name.encode("utf-8"), fileObj))
    return HttpResponse("<script>window.parent.CKEDITOR.tools.callFunction(0,'" + url + "', '');</script>")

# coding=utf-8
import hashlib

from django.http import HttpResponseNotModified


class EtagComputeController(object):
    def process_response(self, request, response):
        # 动态页面ETAG缓存策略计算
        if hasattr(response, "content"):
            Etag = "W/" + hashlib.md5(response.content).hexdigest()
            if request.META.get("HTTP_IF_NONE_MATCH") != Etag:
                response["ETag"] = Etag
                return response
            else:
                return HttpResponseNotModified()
        else:
            return response

# coding: utf-8

import json
from django.http import QueryDict
from django.http import HttpResponse
from django.middleware.csrf import rotate_token

from blog.models import Content, Comment, CommentForm
from blog.views import utils


def comment(request, **kwargs):

    method = kwargs.get("method")
    result = utils.get_base_result(request)

    if method == "add":
        try:
            data = QueryDict('').copy()
            data.update(request.POST)

            if data.get("source", None):
                post_id = data.get("source", None)
                if Content.objects.get(pk=post_id):
                    if not Content.objects.get(pk=post_id).allow_comment:
                        result.update({
                                    "success": False,
                                    "msg": "无评论权限"
                                })
                        return HttpResponse(json.dumps(result), content_type="application/json")

            if 'HTTP_X_FORWARDED_FOR' in request.META:
                ip = request.META['HTTP_X_FORWARDED_FOR']
            else:
                ip = request.META['REMOTE_ADDR']
            data.update({
                "ip": ip
            })
            form = CommentForm(data=data, instance=Comment())

            if form.is_valid():
                new_comment = form.save()
                result.update({
                    "success": True,
                    "commentId": new_comment.id
                })
                # rotate_token(request)  # 刷新token
            else:
                errors = ""
                for field in form.errors:
                    errors += form.errors[field][0]
                result.update({
                    "success": False,
                    "msg": errors
                })

        except ValueError:
            result.update({
                "success": False,
                "msg": "评论失败，请继续重试"
            })

    return HttpResponse(json.dumps(result), content_type="application/json")

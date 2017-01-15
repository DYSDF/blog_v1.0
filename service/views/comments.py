# coding: utf-8

import json

from django.http import QueryDict, HttpResponse
from dss.Serializer import serializer

from blog.models import Content
from blog.models import Comment, CommentForm

from service.views import utils


def comments(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)

    result = utils.get_base_result()

    if request.method == "GET":
        queries.update(request.GET)

        if queries.get("articleId", None):
            article_id = queries.get("articleId")
            content = Content.objects.get(pk=article_id)
            if content:
                # comment_list = content.comments.all().annotate(count=Count("reply")).order_by("date")
                comment_list = content.comments.all().order_by("date")
                result.update({
                    "success": True,
                    "data": serializer(comment_list, datetime_format="timestamp")
                })
            else:
                result.update({
                    "success": False,
                    "data": []
                })

            result.update({
                "enableComment": content.allow_comment
            })
        else:
            result.update({
                "success": True,
                "data": serializer(Comment.objects.accessible(request.user).order_by("-date")[:10], datetime_format="timestamp", foreign=True)
            })

    elif request.method == "POST":
        queries.update(request.POST)

        if queries.get("source", None):

            source_id = queries.get("source")

            if not Content.objects.get(pk=source_id) or not Content.objects.get(pk=source_id).allow_comment:
                result.update({
                    "success": False
                })
                return HttpResponse(json.dumps(result), content_type="application/json")

            if 'HTTP_X_FORWARDED_FOR' in request.META:
                ip = request.META['HTTP_X_FORWARDED_FOR']
            else:
                ip = request.META['REMOTE_ADDR']
            queries.update({
                "ip": ip
            })

            form = CommentForm(data=queries, instance=Comment())

            if form.is_valid():
                new_comment = form.save()
                result.update({
                    "success": True,
                    "data": serializer(new_comment, datetime_format="timestamp")
                })
            else:
                errors = []
                for field in form.errors:
                    errors.append(form.errors[field][0])
                result.update({
                    "success": False,
                    "data": " / ".join(errors)
                })
        else:
            result.update({
                "success": False
            })

    return HttpResponse(json.dumps(result), content_type="application/json")

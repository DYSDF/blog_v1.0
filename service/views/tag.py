# coding: utf-8
import json

from django.db.models import Count
from django.http import HttpResponse
from django.http import QueryDict

from blog.models import Tags

from dss.Serializer import serializer

from service.views import utils


def tag(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)

    result = utils.get_base_result()

    if request.method == "GET":
        queries.update(request.GET)

        if queries.get("articleId", None):
            article_id = queries.get("articleId")

            tags = Tags.objects.filter(post__pk=article_id).annotate(count=Count("post")).order_by("-count", "tag")
            result.update({
                "success": True,
                "data": serializer(tags,
                                   datetime_format="string")
            })
        else:
            result.update({
                "success": True,
                "data": serializer(
                    Tags.objects.accessible(request.user).annotate(count=Count("post")).order_by("-count", "tag"),
                    datetime_format="string",
                    foreign=True)
            })
    elif request.method == "POST":
        queries.update(request.POST)

        if queries.get("source", None):
            result.update({})
        else:
            result.update({
                "success": False
            })

    return HttpResponse(json.dumps(result), content_type="application/json")

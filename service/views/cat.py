# coding: utf-8
import json

from django.db.models import Count, Sum
from django.http import HttpResponse
from django.http import QueryDict

from blog.models import Cats

from dss.Serializer import serializer

from service.views import utils


def cat(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)

    result = utils.get_base_result()

    if request.method == "GET":
        queries.update(request.GET)

        if queries.get("articleId", None):
            article_id = queries.get("articleId")
            content_cat = Cats.objects.get(post_pk=article_id)
            if content_cat:
                result.update({
                    "success": True,
                    "data": serializer(content_cat.annotate(count=Count("post")).order_by("-count", "cat"),
                                       datetime_format="timestamp")
                })
            else:
                result.update({
                    "success": False
                })
        else:
            cat_list = Cats.objects.accessible(request.user)\
                .annotate(count=(Count("post") +
                                 Count("childType__post") +
                                 Count("childType__childType__post") +
                                 Count("childType__childType__childType__post") +
                                 Count("childType__childType__childType__childType__post") +
                                 Count("childType__childType__childType__childType__childType__post")))

            result.update({
                "success": True,
                "data": serializer(cat_list.order_by("-count", "-cat"), datetime_format="timestamp", foreign=True)
            })
    elif request.method == "POST":
        queries.update(request.POST)

    return HttpResponse(json.dumps(result), content_type="application/json")

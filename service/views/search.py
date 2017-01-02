# coding: utf-8
import json

from django.db.models import Q
from django.http import QueryDict, HttpResponse

from blog.models import Content, Cats, Tags, Authors
from service.views import utils


def search(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(request.GET)

    entries = Content.objects.accessible(request.user)

    search_type = queries.get("type", "")
    search_value = queries.get("value", "")

    if search_type == "cat":
        data = entries.filter(cat=search_value)
        keyword = Cats.objects.get(pk=search_value).cat

    elif search_type == "tag":
        data = entries.filter(tag=search_value)
        keyword = Tags.objects.get(pk=search_value).tag

    elif search_type == "author":
        data = entries.filter(author=search_value)
        keyword = Authors.objects.get(pk=search_value).name
    else:
        """
        以下部分为全局搜索
        支持get和django网址方式搜索
        为默认搜索方式
        """
        search_string = Q()
        search_string = search_string | Q(content__contains=search_value)
        search_string = search_string | Q(tag__tag__contains=search_value)
        search_string = search_string | Q(cat__cat__contains=search_value)

        data = entries.filter(search_string)
        keyword = search_value

    # 获取分页参数
    page = queries.get('page', 1)
    rows = queries.get('rows', 10)
    pagination_result = utils.get_pagination_result(data, page=page, rows=rows)
    pagination_result.update({
        'keyword': keyword
    })

    result = utils.get_base_result()
    result.update({
        'success': True,
        'data': pagination_result
    })

    return HttpResponse(json.dumps(result), content_type="application/json")

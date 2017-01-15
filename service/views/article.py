# coding: utf-8
import json

import datetime
from django.http import QueryDict, HttpResponse
from dss.Serializer import serializer

from blog.models import Content, Comment

from service.views import utils


# 博客列表
def article_list(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)

    result = {}

    # 获取列表
    if request.method == 'GET':
        queries.update(request.GET)

        # 获取分页参数
        page = queries.get('page', 1)
        rows = queries.get('rows', 10)

        # 获取queryset对象
        contents = Content.objects.accessible(request.user)

        pagination_result = utils.get_pagination_result(contents, page=page, rows=rows)

        # 获取评论数
        for item in pagination_result.get("data", []):
            comments = Comment.objects.accessible(request.user).filter(source__id=item["id"])
            item.update({
                'comments': comments.__len__()
            })

        result.update(pagination_result)

    elif request.method == "POST":
        queries.update(request.POST)

    return HttpResponse(json.dumps(result), content_type="application/json")


# 博客时间轴
def article_time(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)

    result = utils.get_base_result()

    articles = Content.objects.accessible(request.user)
    time_tree = {}
    for a in articles:
        y = datetime.datetime.strftime(a.create_time, "%Y")
        m = datetime.datetime.strftime(a.create_time, "%m")
        d = datetime.datetime.strftime(a.create_time, "%d")
        time_tree.setdefault(y, {}).setdefault(m, {}).setdefault(d, []).append(serializer(a, datetime_format='timestamp'))
    # for yItem in time_tree:
    #     for mItem in time_tree[yItem]:
    #         time_tree[yItem][mItem] = sorted(time_tree[yItem][mItem].iteritems(), key=lambda item: item[0], reverse=True)
    #         time_tree[yItem] = sorted(time_tree[yItem].iteritems(), key=lambda item: item[0], reverse=True)

    # time_tree = sorted(time_tree.iteritems(), key=lambda item: item[0], reverse=True)

    result.update({
        'success': True,
        'data': time_tree
    })

    return HttpResponse(json.dumps(result), content_type="application/json")


# 博文详情
def article_detail(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(request.GET)

    result = utils.get_base_result()

    # 获取queryset对象
    objects = Content.objects.accessible(request.user)

    article_id = queries.get("id")
    content = objects.get(pk=article_id)

    result.update({
        'success': True,
        'data': serializer(content, datetime_format='timestamp', foreign=True, many=True)
    })

    id_list = objects.values_list("pk", flat=True)
    id_list = list(id_list)
    if id_list:
        id_index = id_list.index(int(article_id))  # 当前id的索引
        if id_index - 1 >= 0:
            result["data"].update({
                "prev": serializer(objects.get(pk=id_list[id_index - 1]), datetime_format='timestamp')
            })
        if id_index + 1 < len(id_list):
            result["data"].update({
                "next": serializer(objects.get(pk=id_list[id_index + 1]), datetime_format='timestamp')
            })

    return HttpResponse(json.dumps(result), content_type="application/json")

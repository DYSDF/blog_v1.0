# coding: utf-8
import json

from django.db.models import Count
from django.http import QueryDict, HttpResponse
from django.template import loader
from dss.Serializer import serializer

from blog.models import Content, CommentForm, Comment

from service.views import utils
from service.views.JSONEncoder import JSONEncoder


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


# 博文详情
def article_detail(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)
    queries.update(request.GET)

    # 获取queryset对象
    objects = Content.objects.accessible(request.user)

    article_id = queries.get("id")
    content = objects.get(pk=article_id)

    id_list = objects.values_list("pk", flat=True)
    dic = {}
    id_list = list(id_list)
    if id_list:
        id_index = id_list.index(int(article_id))  # 当前id的索引
        if id_index - 1 >= 0:
            dic.update({
                "prev": objects.get(pk=id_list[id_index - 1])
            })
        if id_index + 1 < len(id_list):
            dic.update({
                "next": objects.get(pk=id_list[id_index + 1])
            })

    comment_list = content.comments.all().annotate(count=Count("reply")).order_by("-date")
    dic.update({
        'result': content,
        "comments": utils.get_comments_tree(request, comment_list=comment_list),
        "comment_form": CommentForm()
    })

    context = utils.get_base_context(request)
    context.update(dic)

    # return render_to_response("post_single.html", context, context_instance=RequestContext(request))
    html = loader.render_to_string(template_name="blog/post_single.html", context=context, request=request)

    return HttpResponse(html)

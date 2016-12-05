# coding: utf-8


# 博文详情
from django.db.models import Count
from django.http import QueryDict, HttpResponse, HttpResponseNotModified
from django.shortcuts import render_to_response
from django.template import RequestContext, loader
from blog.models import Content, CommentForm
from blog.views import utils


def detail(request, **kwargs):
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

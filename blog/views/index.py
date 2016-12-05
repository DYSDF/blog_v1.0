# coding: utf-8


# 博客首页入口
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import QueryDict, HttpResponse
from django.template import loader

from blog.models import Content
from blog.views import utils


def index(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)
    queries.update(request.GET)

    # 获取queryset对象
    objects = Content.objects.accessible(request.user)

    # 获取传参页码
    try:
        page = queries.get('page')
    except ValueError:
        page = 1

    # 建立分页实例
    paginator = Paginator(objects, 10)
    try:
        article = paginator.page(page)
    except PageNotAnInteger:
        article = paginator.page(1)
    except EmptyPage:
        article = paginator.page(paginator.num_pages)

    context = utils.get_base_context(request)

    context.update({
        'result': article,
        "page": article.number,
        "rows": paginator.count,
        'paginator': article.paginator,
        "current_url": "/"
    })

    html = loader.render_to_string(template_name="blog/post_wrap.html", context=context, request=request)

    return HttpResponse(html)

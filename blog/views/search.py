# coding: utf-8
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from django.http import QueryDict, HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext, loader

from blog.models import Content, Cats, Tags, Authors
from blog.views import utils


def search(request, **kwargs):
    queries = QueryDict('').copy()
    queries.update(kwargs)
    queries.update(request.GET)

    entries = Content.objects.accessible(request.user)

    search_type = queries.get("type", "keyword")

    if search_type == "cat":
        """
        归档搜索
        只支持归档id搜索
        不允许自定义搜索
        """
        kw = queries.get("cat")
        entries = entries.filter(cat=kw)
        show_name = Cats.objects.get(pk=kw)
    elif search_type == "tag":
        kw = queries.get("tag")
        entries = entries.filter(tag=kw)
        show_name = Tags.objects.get(pk=kw)
    elif search_type == "author":
        kw = queries.get("author")
        entries = entries.filter(author=kw)
        show_name = Authors.objects.get(pk=kw)
    else:
        """
        以下部分为全局搜索
        支持get和django网址方式搜索
        为默认搜索方式
        """
        kw = queries.get("kw")
        search_string = Q()
        search_string = search_string | Q(content__contains=kw)
        search_string = search_string | Q(tag__tag__contains=kw)
        search_string = search_string | Q(cat__cat__contains=kw)
        entries = entries.filter(search_string)
        show_name = kw

    # 获取传参页码
    try:
        page = queries.get('page')
    except ValueError:
        page = 1

    # 建立分页实例
    paginator = Paginator(entries, 10)
    try:
        result = paginator.page(page)
    except PageNotAnInteger:
        result = paginator.page(1)
    except EmptyPage:
        result = paginator.page(paginator.num_pages)

    context = utils.get_base_context(request)
    context.update({
        'result': result,
        'type': search_type,
        'show_name': show_name,
        "page": result.number,
        "rows": paginator.count,
        'paginator': result.paginator,
        'current_url': "/search/" + search_type + "/" + kw + "/",  # 当前页面URL
    })

    html = loader.render_to_string(template_name="blog/post_search.html", context=context, request=request)
    return HttpResponse(html)

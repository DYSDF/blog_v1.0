# coding: utf-8


# 文章列表
import datetime

from django.shortcuts import render_to_response
from django.template import RequestContext, loader
from django.http import HttpResponse

from blog.models import Content

from blog.views import utils


def post_list(request):
    article_list = Content.objects.accessible(user=request.user).order_by("-create_time")
    result = {}
    for a in article_list:
        y = datetime.datetime.strftime(a.create_time, "%Y")
        m = datetime.datetime.strftime(a.create_time, "%m")
        d = datetime.datetime.strftime(a.create_time, "%d")
        result.setdefault(y, {}).setdefault(m, {}).setdefault(d, []).append(a)
    for yItem in result:
        for mItem in result[yItem]:
            result[yItem][mItem] = sorted(result[yItem][mItem].iteritems(), key=lambda item: item[0], reverse=True)
        result[yItem] = sorted(result[yItem].iteritems(), key=lambda item: item[0], reverse=True)
    result = sorted(result.iteritems(), key=lambda item: item[0], reverse=True)

    context = utils.get_base_context(request)
    context.update({
        "result": result,
    })

    html = loader.render_to_string(template_name="blog/post_line.html", context=context, request=request)
    return HttpResponse(html)

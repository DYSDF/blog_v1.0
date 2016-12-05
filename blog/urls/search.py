# coding: utf-8
from django.conf.urls import url
from blog.views.search import search


urlpatterns = [

    url(r'(?P<type>keyword)/(?P<kw>\w+)$', search),  # 关键字搜索
    url(r'(?P<type>keyword)/(?P<kw>\w+)/page/(?P<page>\d+)$', search),  # 关键字搜索(分页)

    url(r'(?P<type>cat)/(?P<cat>\d+)$', search),  # 归档搜索
    url(r'(?P<type>cat)/(?P<cat>\d+)/page/(?P<page>\d+)$', search),  # 归档搜索(分页)

    url(r'(?P<type>tag)/(?P<tag>\d+)$', search),  # 标签搜索
    url(r'(?P<type>tag)/(?P<tag>\d+)/page/(?P<page>\d+)$', search),  # 标签搜索(分页)

    url(r'(?P<type>author)/(?P<author>\d+)$', search),  # 作者搜索
    url(r'(?P<type>author)/(?P<author>\d+)/page/(?P<page>\d+)$', search),  # 作者搜索(分页)

]

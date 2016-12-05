# coding: utf-8

"""siteRoot URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views import static

from blog.views.index import index as blog_index
from blog.views.search import search as blog_search
from blog.views.post_line import post_list as blog_list
from siteRoot import settings

urlpatterns = [
    # 首页入口
    url(r'^(page/(?P<page>\d+))?$', blog_index),

    # 博文入口
    url(r'^article/', include('blog.urls.post')),
    url(r'^article$', blog_list),  # 博文列表

    # 搜索入口
    url(r'^search/', include('blog.urls.search')),
    url(r'^search$', blog_search),

    # 评论入口（包括文章品论与留言板）
    url(r'^comment/', include('blog.urls.comment')),

    # 文件管理入口
    url(r'^filemanage/', include("fileManage.urls.index")),

    # 音乐入口
    url(r'^music/', include('music.urls')),

    # 程序管理员入口
    url(r'^admin/', admin.site.urls),

    # 静态文件处理
    # url(r'^static/(?P<path>.*)$', static.serve,
    #     {'document_root': settings.STATIC_ROOT}),
    url(r'^media/(?P<path>.*)$', static.serve,
        {'document_root': settings.MEDIA_ROOT}),
]

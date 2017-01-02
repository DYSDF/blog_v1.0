# coding: utf-8
from django.conf.urls import url
from service.views.search import search


urlpatterns = [

    url(r'^$', search),  # 关键字搜索

]

# coding: utf-8
from django.conf.urls import url
from service.views import article

urlpatterns = [
    url(r'^$', article.article_list),  # 博文列表
    url(r'^detail$', article.article_detail),  # 博文详情
]

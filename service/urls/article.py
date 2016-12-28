# coding: utf-8
from django.conf.urls import url
from service.views import article

urlpatterns = [
    url(r'^$', article.article_list),  # 博文列表
    url(r'^(?P<time>\d{4}-\d{2}-\d{2})/(?P<id>\d+)$', article.article_detail),  # 直接显示内容
]

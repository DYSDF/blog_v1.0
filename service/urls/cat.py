# coding: utf-8

from django.conf.urls import url
from service.views.cat import cat

urlpatterns = [
    url(r'^$', cat),  # 归档列表
]

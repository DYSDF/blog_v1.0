# coding: utf-8

from django.conf.urls import url
from service.views.tag import tag

urlpatterns = [
    url(r'^$', tag),  # 标签列表
]

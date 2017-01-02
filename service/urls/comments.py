# coding: utf-8

from django.conf.urls import url

from service.views.comments import comments

urlpatterns = [
    url(r'^$', comments),  # 回复列表
]

# coding: utf-8
from django.conf.urls import url
from service.views.options import nav_menu, simple_page

urlpatterns = [
    url(r'^nav_menu$', nav_menu),  # 菜单那列表

    url(r'^simple_page/(?P<url>.*?)$', simple_page),  # 简单页面
]

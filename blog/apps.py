# coding=utf-8

"""
APP配置相关项，可以自定义APP在后台ADMIN中显示的名称
"""

from __future__ import unicode_literals

from django.apps import AppConfig


class BlogConfig(AppConfig):
    name = 'blog'
    verbose_name = u'博客管理'

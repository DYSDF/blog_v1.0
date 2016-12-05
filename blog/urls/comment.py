# encoding: utf-8

from django.conf.urls import url
from blog.views.comments import comment

urlpatterns = [

    url(r'^(?P<method>add)$', comment),  # 添加评论

]

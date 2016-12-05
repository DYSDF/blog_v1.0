# encoding: utf-8
from django.conf.urls import url
from blog.views.article import detail
from blog.views.upload_file import upload_img

urlpatterns = [

    url(r'^(?P<time>\d{4}-\d{2}-\d{2})/(?P<id>\d+)$', detail),  # 直接显示内容

    url(r'upload/img/', upload_img),  # 上传图片

]

# coding = utf-8
from django.conf.urls import url
from fileManage.views.index import index, upload

urlpatterns = [
    url(r'^$', index),
    url(r'^add$', upload)
]

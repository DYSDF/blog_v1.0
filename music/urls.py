# encoding: utf-8

from django.conf.urls import url
from music import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^playlist$', views.getPlayList),
    url(r'^toplist$', views.getTopList),
    url(r'^getLyric$', views.getSongLyric),
]

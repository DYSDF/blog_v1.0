# coding: utf-8
from django.conf.urls import url, include

urlpatterns = [
    url(r'^article/', include('service.urls.article')),

    url(r'^comment/', include('service.urls.comments')),

    url(r'^cat/', include('service.urls.cat')),

    url(r'^tag/', include('service.urls.tag')),

    url(r'^search/', include('service.urls.search')),

    url(r'^user/', include('service.urls.customer')),

    url(r'^site/', include('service.urls.options'))
]

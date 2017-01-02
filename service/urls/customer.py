# coding: utf-8

from django.conf.urls import url
from service.views.customer import csrftoken

urlpatterns = [

    url(r'^csrftoken$', csrftoken),  # csrftoken

]

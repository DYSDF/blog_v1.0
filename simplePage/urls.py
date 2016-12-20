from django.conf.urls import url
from simplePage import views

urlpatterns = [
    url(r'^(?P<url>.*)$', views.flatpage),
]

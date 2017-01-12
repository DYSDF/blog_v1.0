# coding: utf-8
import json

from django.http import HttpResponse, HttpResponsePermanentRedirect
from django.contrib.sites.shortcuts import get_current_site
from service.views import utils
from blog.models import Settings
from simplePage.models import FlatPage

from dss.Serializer import serializer


def nav_menu(request, **kwargs):
    result = utils.get_base_result()

    site_id = get_current_site(request).id
    site_settings = Settings.objects.filter(sites__id=site_id)
    nav_menu_list = []
    if len(site_settings):
        nav_menu_list = site_settings[0].nav_menu.all()

    result.update({
        'success': True,
        'data': serializer(nav_menu_list)
    })
    return HttpResponse(json.dumps(result), content_type="application/json")


def simple_page(request, url):
    if not url.startswith('/'):
        url = '/' + url
    site_id = get_current_site(request).id
    f = FlatPage.objects.get(url=url, sites=site_id)
    if f is None:
        if not url.endswith('/') and settings.APPEND_SLASH:
            url += '/'
            f = FlatPage.objects.get(url=url, sites=site_id)
            return HttpResponsePermanentRedirect('%s/' % request.path)
    try:
        f = FlatPage.objects.get(url=url, sites=site_id)
    except Http404:
        if not url.endswith('/') and settings.APPEND_SLASH:
            url += '/'
            f = get_object_or_404(FlatPage, url=url, sites=site_id)
            return HttpResponsePermanentRedirect('%s/' % request.path)
        else:
            raise
    return render_flatpage(request, f)

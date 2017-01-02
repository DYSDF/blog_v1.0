# coding: utf-8
import json

from django.db.models import Count
from django.http import HttpResponse
from django.http import QueryDict
from django.middleware.csrf import get_token as get_csrf_token

from dss.Serializer import serializer

from service.views import utils


def csrftoken(request, **kwargs):
    result = utils.get_base_result()
    result.update({
        'success': True,
        'data': get_csrf_token(request)
    })
    return HttpResponse(json.dumps(result), content_type="application/json")

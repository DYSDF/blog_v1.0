# coding: utf-8

from django import template
register = template.Library()


@register.simple_tag(takes_context=True)
def basePath(context):
    request = context['request']
    return "http://" + request.META["HTTP_HOST"]

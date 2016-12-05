# coding: utf-8
from django import template
from blog.models import Content
from siteRoot.templatetags import baseTags

register = template.Library()


@register.simple_tag(takes_context=True)
def article_url(context, pk):
    c = Content.objects.filter(pk=pk)[0]
    return baseTags.basePath(context) + c.create_time.strftime("/blog/article/%Y-%m-%d/") + str(c.id)

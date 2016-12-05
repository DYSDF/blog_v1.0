# coding: utf-8
from django.contrib import admin
from django.db import models


class TagsManager(models.Manager):
    def accessible(self, user):
        if user.is_superuser:
            result = Tags.objects.all()
        else:
            result = Tags.objects.filter(post__public=1)
        return result


class Tags(models.Model):
    tag = models.CharField(max_length=25, verbose_name=u'文章标签', help_text=u'标注文章属于哪些类型')

    objects = TagsManager()

    class Meta:
        verbose_name = u'标签'
        verbose_name_plural = u'类型标签列表'
        # ordering = ['cat']

    def __unicode__(self):
        return u'%s' % self.tag


admin.site.register(Tags)

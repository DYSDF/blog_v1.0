# coding: utf-8

from django.db import models
from django.contrib import admin


# 作者列表
class Authors(models.Model):
    gender_choices = [
        (0, "男"),
        (1, "女"),
        (2, "未知"),
    ]
    name = models.CharField(default=u"断崖上的风", max_length=100, verbose_name=u'作者')
    sex = models.IntegerField(verbose_name=u'性别', choices=gender_choices)

    class Meta:
        verbose_name_plural = u'作者列表'
        verbose_name = u'作者'

    def __unicode__(self):
        return u'%s' % self.name


admin.site.register(Authors)

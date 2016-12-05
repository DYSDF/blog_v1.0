# coding: utf-8
import datetime
from django.contrib import admin
from django.db import models


# 留言信息表
class LevelMsg(models.Model):
    name = models.CharField(max_length=25, verbose_name=u'姓名')
    content = models.TextField(max_length=200, verbose_name=u'内容')
    email = models.EmailField(max_length=25, verbose_name=u'Email')
    date = models.DateTimeField(verbose_name=u'时间', default=datetime.datetime.now)
    reply_to = models.ForeignKey('self', null=True, blank=True, related_name=u'comment', verbose_name=u'回复')
    ip = models.GenericIPAddressField(verbose_name=u'IP', null=True, blank=True)
    site = models.URLField(max_length=100, verbose_name=u'网站', null=True, blank=True)

    class Meta:
        verbose_name = u'留言'
        verbose_name_plural = u'留言信息列表'
        ordering = ['-date']

    def __unicode__(self):
        return self.content


class LevelMsgAdmin(admin.ModelAdmin):
    list_display = ('name', 'content', 'email', 'ip')

    def save_model(self, request, obj, form, change):
        if 'HTTP_X_FORWARDED_FOR' in request.META:
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
        obj.ip = ip
        obj.save()


admin.site.register(LevelMsg, LevelMsgAdmin)

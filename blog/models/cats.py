# coding: utf-8
from django.contrib import admin
from django.db import models


# 文章类型列表
class CatsManager(models.Manager):
    def accessible(self, user):
        if user.is_superuser:
            result = Cats.objects.all()
        else:
            result = Cats.objects.filter(post__public=1)
        return result


class Cats(models.Model):
    cat = models.CharField(max_length=25, verbose_name=u'归档标签', help_text=u'用于给文章归档分类')
    base_type = models.ForeignKey('self', null=True, blank=True, verbose_name=u'所属类别', related_name="baseType")

    objects = CatsManager()

    class Meta:
        verbose_name = u'归档标签'
        verbose_name_plural = u'归档标签列表'
        # ordering = ['cat']

    def __unicode__(self):
        return u'%s' % self.cat


admin.site.register(Cats)

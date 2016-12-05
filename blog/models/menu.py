# coding: utf-8

from django.contrib import admin
from django.contrib.sites.models import Site
from django.db import models


class NavMenu(models.Model):
    parent = models.ForeignKey('self', null=True, blank=True, related_name=u'childMenu', verbose_name=u"父级菜单")
    title = models.CharField(max_length=20, verbose_name=u'菜单名称')
    href = models.CharField(max_length=200, verbose_name=u'链接')
    site = models.ManyToManyField(Site, verbose_name=u'应用站点')
    create_time = models.DateTimeField(auto_now_add=True, null=True, verbose_name=u"创建时间")
    create_user = models.ForeignKey('accounts.User', verbose_name=u'创建人', null=True, blank=True,
                                    related_name=u'create_menu', editable=False)
    update_time = models.DateTimeField(auto_now=True, null=True, verbose_name=u'修改时间')
    update_user = models.ForeignKey('accounts.User', null=True, blank=True, verbose_name=u'修改人',
                                    related_name=u'update_menu', editable=False)

    def __unicode__(self):
        return u"%s" % self.title

    class Meta:
        verbose_name_plural = u'菜单列表'
        verbose_name = u'菜单'


class NavMenuAdmin(admin.ModelAdmin):
    list_display = ('title', 'parent', 'href', 'update_time', 'update_user')
    list_filter = ['create_time', 'update_time']
    search_fields = ['title', 'href', 'site']

    def save_model(self, request, obj, form, change):
        if obj.create_user is None:
            obj.create_user = request.user
        obj.update_user = request.user
        obj.save()


admin.site.register(NavMenu, NavMenuAdmin)

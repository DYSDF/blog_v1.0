# coding: utf-8
import time

from django.contrib import admin
from django.contrib.sites.models import Site
from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from libs.FileManage.FileStorage import ImageStorage


class Settings(models.Model):
    sites = models.OneToOneField(Site, verbose_name=u'投放站点')
    head_img = models.ImageField(verbose_name=u'文章头图', blank=True,
                                 upload_to='./blog/headImg/%s/' % time.strftime('%Y-%m-%d'),
                                 storage=ImageStorage(re_size=(1100, None)))
    enable = models.BooleanField(default=True, verbose_name=u'是否启用')
    create_time = models.DateTimeField(verbose_name=u'创建时间', auto_now_add=True)
    update_time = models.DateTimeField(verbose_name=u'修改时间', auto_now=True)

    def __unicode__(self):
        return u'%s' % self.sites

    class Meta:
        ordering = ['-create_time']
        verbose_name = u'网站设置'
        verbose_name_plural = u'网站设置列表'


# 博文保存前处理
@receiver(pre_save, sender=Settings)
def pre_content_save(sender, **kwargs):
    new_object = kwargs["instance"]
    old_object = Settings.objects.filter(id=new_object.id)

    # 头图处理
    if len(old_object) > 0:
        old_head_img = old_object[0].head_img.name
        new_head_img = new_object.head_img.name
        if old_head_img != new_head_img and old_head_img:
            new_object.head_img.storage.delete(old_head_img)


# 博文删除后处理
@receiver(post_delete, sender=Settings)
def after_content_delete(sender, **kwargs):
    new_object = kwargs["instance"]
    if new_object.head_img.name:
        new_object.head_img.storage.delete(new_object.head_img.name)


class NavMenu(models.Model):
    target_choices = [
        ("_self", "默认"),
        ("_blank", "新窗口"),
        ("_parent", "父框架"),
        ("_top", "顶层框架"),
    ]

    apply = models.ForeignKey("Settings", related_name=u'nav_menu')
    parent = models.ForeignKey('self', null=True, blank=True, related_name=u'childMenu', verbose_name=u"父级菜单")
    title = models.CharField(max_length=20, verbose_name=u'菜单名称')
    href = models.CharField(max_length=200, verbose_name=u'链接')
    target = models.CharField(verbose_name=u'打开方式', max_length=20, choices=target_choices, default="_self")
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


class NavMenuInline(admin.StackedInline):
    model = NavMenu
    extra = 0


class SettingsAdmin(admin.ModelAdmin):
    list_display = ('sites', 'enable', 'create_time')
    # list_filter = ['author', 'tag', 'allow_comment', 'public']
    # search_fields = ['title', 'content']
    inlines = [NavMenuInline, ]


admin.site.register(Settings, SettingsAdmin)

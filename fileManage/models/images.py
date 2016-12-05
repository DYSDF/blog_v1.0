# coding: utf-8
import time

from django import forms
from django.contrib import admin
from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from libs.FileManage.FileStorage import ImageStorage


class Images(models.Model):
    source = models.CharField(verbose_name=u'来源', max_length=100, blank=True, null=True)
    origin = models.ImageField(verbose_name=u"原图", blank=True, null=True,
                              upload_to='./images/origin/%s/' % time.strftime('%Y-%m-%d'),
                              storage=ImageStorage())
    thumb = models.ImageField(blank=True, verbose_name=u"缩略图",
                              upload_to='./images/thumb/%s/' % time.strftime('%Y-%m-%d'),
                              storage=ImageStorage(re_size=(500, None)))
    create_time = models.DateTimeField(verbose_name=u"时间戳", auto_now=True)

    def __unicode__(self):
        return "%s" % self.source

    class Meta:
        verbose_name = u'图片'
        verbose_name_plural = u'图片列表'


# 文章图片替换
@receiver(pre_save, sender=Images)
def images_save(sender, **kwargs):
    new_images = kwargs["instance"]
    old_images = Images.objects.filter(id=new_images.id)
    if len(old_images) > 0:
        # 删除缩略图
        thumb_storage = old_images[0].thumb.storage
        old_thumb = old_images[0].thumb.name
        new_thumb = new_images.thumb.name
        if old_thumb != new_thumb and old_thumb:
            thumb_storage.delete(old_thumb)

        # 删除原图
        origin_storage = old_images[0].origin.storage
        old_origin = old_images[0].origin.name
        new_origin = new_images.origin.name
        if old_origin != new_origin and old_origin:
            origin_storage.delete(old_origin)


# 文章图片删除时，删除存储空间中的文件
@receiver(post_delete, sender=Images)
def images_delete(sender, **kwargs):
    images = kwargs['instance']
    thumb_storage, thumb_name = images.thumb.storage, images.thumb.name
    origin_storage, origin_name = images.origin.storage, images.origin.name

    # 删除缩略图
    if thumb_name:
        thumb_storage.delete(thumb_name)

    # 删除原图
    if origin_name:
        origin_storage.delete(origin_name)


# 注册管理
class ImagesAdmin(admin.ModelAdmin):
    list_display = ('source', 'thumb', 'origin')

admin.site.register(Images, ImagesAdmin)

# 注册内联管理
# class ContentImagesAdmin(admin.StackedInline):
#     model = ContentImages
#     extra = 1
#     admin.site.register(ContentImages)


# 保存图片form
class ImagesForm(forms.ModelForm):
    class Meta:

        model = Images

        fields = ("source", "origin", "thumb")


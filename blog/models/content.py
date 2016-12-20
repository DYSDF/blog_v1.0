# coding: utf-8
import time
import uuid

from django.contrib import admin
from django.contrib.sites.models import Site
from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from pyquery import PyQuery

import cgi

from libs.FileManage.FileStorage import ImageStorage


class ContentManager(models.Manager):
    # 根据用户判断返回全部还是部分
    def accessible(self, user):
        if user.is_superuser:
            entries = Content.objects.all()
        else:
            entries = Content.objects.filter(public=True)
        return entries


# 提取前文章前几行文本
def get_first_lines(String=""):
    """提出摘要, 最终返回以HTML片段. 代表插图 + 前N个文字"""
    orig_html = PyQuery(String)
    # 优先提取带有 cover 类的图片作为封面
    # cover = orig_html('img.cover:first') or orig_html('img:first')
    # if cover:
    #     try:
    #         # 清除默认属性
    #         cover.removeAttr('style').removeAttr('width').removeAttr('height')
    #     except KeyError:
    #         pass
    #
    #     cover.addClass('cover')
    #     orig_src = cover.attr('src')
    #     # 如果是本地图片, 则封面img标签使用django-filebrowser生成的缩略图
    #     if orig_src.startswith(settings.MEDIA_URL):
    #         print "更新封面"
    #         relative_path = orig_src.replace(settings.MEDIA_URL, '')
    #         if relative_path.startswith(settings.FILEBROWSER_VERSIONS_BASEDIR):
    #             # 如果已经引用的是FileBrowser生成的小尺寸图片,
    #             # 则试图推导出原图路径, 并根据原图生成缩略图.
    #             relative_path = re.sub(r'^%s' % settings.FILEBROWSER_VERSIONS_BASEDIR,
    #                                    settings.FILEBROWSER_DIRECTORY, relative_path)
    #
    #             # FileBrowser生成图片的后缀模式:
    #             postfix_pat = '|'.join(['_' + i for i in settings.FILEBROWSER_ADMIN_VERSIONS])
    #             relative_path = re.sub(r'(%s)\.' % postfix_pat, '.', relative_path)
    #         fileobject = FileObject(relative_path)
    #         if fileobject.exists():
    #             fileobject = fileobject.original
    #             thumbnail = fileobject.version_generate('thumbnail')
    #             cover.attr('src', thumbnail.url).attr('data-orig-src', orig_src)
    #             cover.css(height='100px', width='100px')
    #         else:
    #             print u'引用的图片不存在: %s' % fileobject.path

    abstract_text = []
    count = 1
    for line in orig_html.children():
        abstract_text.append("<p>" + cgi.escape(PyQuery(line).text()) + "</p>")
        if count > 4:
            break
        else:
            count += 1
    return "".join(abstract_text)


# 文章内容列表
class Content(models.Model):
    title = models.CharField(max_length=200, verbose_name=u'标题')
    author = models.ForeignKey('blog.Authors', verbose_name=u'作者', related_name='author')
    head_img = models.ImageField(verbose_name=u'文章头图', blank=True,
                                 upload_to='./blog/content/headImg/%s/' % time.strftime('%Y-%m-%d'),
                                 storage=ImageStorage(re_size=(150, 105)))
    cat = models.ForeignKey('blog.Cats', related_name='post', verbose_name=u'归档类型', help_text=u'用于给文章归档分类')
    tag = models.ManyToManyField('blog.Tags', related_name='post', verbose_name=u'标签', help_text=u'标注博文属于哪些类型的')
    read_hit = models.IntegerField(default=0, editable=False, verbose_name=u'阅读数')
    like_hit = models.IntegerField(default=0, editable=False, verbose_name=u'点赞数')
    content = models.TextField(verbose_name=u'内容')
    abstract = models.TextField(verbose_name=u'摘要', null=True, blank=True)
    create_time = models.DateTimeField(verbose_name=u'创建时间', auto_now_add=True)
    update_time = models.DateTimeField(verbose_name=u'修改时间', auto_now=True)
    allow_comment = models.BooleanField(default=True, verbose_name=u'是否允许评论')
    public = models.BooleanField(default=True, verbose_name=u'公开文章')
    sites = models.ManyToManyField(Site, verbose_name=u'投放站点')

    # 传递给引用图片的唯一标识
    img_mark = models.CharField(default=uuid.uuid1, max_length=100, verbose_name=u"图片标识", editable=False)

    objects = ContentManager()

    def __unicode__(self):
        return u'%s' % self.title

    class Meta:
        ordering = ['-create_time']
        verbose_name = u'博文'
        verbose_name_plural = u'博客列表'


# 博文保存前处理
@receiver(pre_save, sender=Content)
def pre_content_save(sender, **kwargs):
    new_object = kwargs["instance"]
    old_object = Content.objects.filter(id=new_object.id)

    # 头图处理
    if len(old_object) > 0:
        old_head_img = old_object[0].head_img.name
        new_head_img = new_object.head_img.name
        if old_head_img != new_head_img and old_head_img:
            new_object.head_img.storage.delete(old_head_img)

    # 摘要处理
    if new_object.abstract is None or new_object.abstract == "":
        new_object.abstract = get_first_lines(new_object.content)


# 博文删除后处理
@receiver(post_delete, sender=Content)
def after_content_delete(sender, **kwargs):
    new_object = kwargs["instance"]
    if new_object.head_img.name:
        new_object.head_img.storage.delete(new_object.head_img.name)


class ContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'update_time', 'public', 'allow_comment')
    list_filter = ['author', 'tag', 'allow_comment', 'public']
    search_fields = ['title', 'content']
    # inlines = [ContentImagesAdmin, ]

    class Media:
        js = (
            'ckeditor/ckeditor.js',
            'ckeditor/blog_config.js'
        )


admin.site.register(Content, ContentAdmin)

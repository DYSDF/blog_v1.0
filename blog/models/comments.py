# coding: utf-8
from __future__ import unicode_literals

from django.contrib import admin
from django.db import models
from django import forms


class CommentManager(models.Manager):
    # 根据用户判断返回全部还是部分
    def accessible(self, user):
        if user.is_superuser:
            entries = Comment.objects.all()
        else:
            entries = Comment.objects.filter(source__public=True)
        return entries


# 评论列表
class Comment(models.Model):
    name = models.CharField(max_length=25, verbose_name='回复者名称')
    email = models.EmailField(max_length=25, verbose_name='回复者Email')
    title = models.CharField(max_length=100, verbose_name='回复主题', null=True, blank=True)
    content = models.TextField(max_length=200, verbose_name='回复内容')
    site = models.URLField(max_length=100, verbose_name='网站', null=True, blank=True)
    date = models.DateTimeField(verbose_name=u'回复日期', auto_now_add=True)
    source = models.ForeignKey("blog.Content", related_name='comments', verbose_name='回复文章', null=True, blank=True)
    reply_to = models.ForeignKey('self', null=True, blank=True, related_name=u'reply', verbose_name='回应')
    ip = models.GenericIPAddressField(blank=True, null=True, verbose_name='IP地址')

    objects = CommentManager()

    class Meta:
        verbose_name = u'回复'
        verbose_name_plural = u'回复信息列表'
        ordering = ['-date']

    def __unicode__(self):
        return u'%s' % self.content


class CommentAdmin(admin.ModelAdmin):
    list_display = ('name', 'content', 'email', 'ip')

    def save_model(self, request, obj, form, change):
        if 'HTTP_X_FORWARDED_FOR' in request.META:
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
        obj.ip = ip
        obj.save()


admin.site.register(Comment, CommentAdmin)


# 评论表对应的Form
class CommentForm(forms.ModelForm):
    class Meta:
        # 表单引用model
        model = Comment

        # 表单使用的Field
        fields = ("name", "email", "content", "site", "source", "reply_to", "ip")

        # Feild对应的label
        # labels = {
        #     "name": u"昵称",
        #     "email": u"邮箱",
        #     "content": u"内容"
        # }

        # 表单渲染处理
        widgets = {
            # 为各个字段渲染成 html 组件添加必要属性
            'name': forms.TextInput(attrs={
                'id': 'comment_name',
                'placeholder': "昵称",
                "class": "text",
            }),
            'email': forms.TextInput(attrs={
                'id': 'comment_email',
                'placeholder': "邮箱",
                "class": "text",
            }),
            'content': forms.Textarea(attrs={
                'id': 'comment_content',
                # 'placeholder': '我来评两句~',
                "class": "textarea"
            }),
            'site': forms.TextInput(attrs={
                'id': 'comment_site',
                'placeholder': '微博或网址',
                "class": "text",
                "type": "url"
            })
        }

        # 改写错误提示
        error_messages = {
            "name": {
                "max_length": u"用户名过长",
                "required": u"用户名不能为空",
                "invalid": u"用户名格式不正确",
            },
            "email": {
                "max_length": u"邮箱地址过长",
                "required": u"邮箱地址不能为空",
                "invalid": u"邮箱地址格式不正确",
            },
            "content": {
                "max_length": u"回复内容文字过长",
                "required": u"回复内容不能为空",
                "invalid": u"回复内容格式不正确",
            },
            "site": {
                "max_length": u"网址过长",
                "invalid": u"网址不正确",
            }
        }

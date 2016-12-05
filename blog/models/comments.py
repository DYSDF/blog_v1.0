# coding: utf-8
import datetime

from django.contrib import admin
from django.db import models
from django import forms
from django.utils import timezone


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
    name = models.CharField(max_length=25, verbose_name=u'回复者名称')
    email = models.EmailField(max_length=25, verbose_name=u'回复者Email')
    content = models.TextField(max_length=200, verbose_name=u'回复内容')
    date = models.DateTimeField(verbose_name=u'回复日期', auto_now_add=True)
    source = models.ForeignKey("blog.Content", related_name=u'comments', verbose_name=u'回复文章')
    reply_to = models.ForeignKey('self', null=True, blank=True, related_name=u'reply', verbose_name=u'回应')
    ip = models.GenericIPAddressField(blank=True, null=True, verbose_name=u'IP地址')

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
        fields = ("name", "email", "content", "source", "reply_to", "ip")

        # Feild对应的label
        # labels = {
        #     "name": u"昵称",
        #     "email": u"邮箱",
        #     "content": u"内容"
        # }

        # 表单渲染处理
        widgets = {
            # 为各个需要渲染的字段指定渲染成什么html组件，主要是为了添加css样式。
            'name': forms.TextInput(attrs={
                'placeholder': "昵称",
                "class": "text",
            }),
            'email': forms.TextInput(attrs={
                'placeholder': "邮箱",
                "class": "text",
            }),
            'content': forms.Textarea(attrs={
                # 'placeholder': '我来评两句~'
                "class": "textarea"
            }),
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
            }
        }

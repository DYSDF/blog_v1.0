# coding=utf-8
from django.contrib import auth
from django.core.exceptions import PermissionDenied
from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _


class UserManager(BaseUserManager):
    def create_user(self, email, username, telephone, password=None):
        if not email:
            raise ValueError(_('Users must have an email address'))

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            telephone=telephone,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, username="", telephone=""):
        user = self.create_user(email=email,
                                username=username,
                                password=password,
                                telephone=telephone
                                )
        user.is_admin = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    # 注意：不继承PermissionsMixin类，是无法实现使用Django Group功能的，本人的项目需要使用所以继承该类。
    email = models.EmailField(
        _('email address'),
        max_length=255,
        unique=True,
        db_index=True
    )
    username = models.CharField(
        _('username'),
        help_text=_('Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        max_length=100,
        null=True, blank=True
        # unique=True,
    )

    telephone = models.CharField(
        verbose_name=u'手机号',
        null=True, blank=True,
        max_length=50
    )

    create_time = models.DateTimeField(
        _('date joined'),
        default=timezone.now
    )

    create_ip = models.GenericIPAddressField(
        verbose_name=u'注册IP地址',
        null=True, blank=True
    )

    is_active = models.BooleanField(
        _('active'),
        default=False,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    is_admin = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def get_full_name(self):
        # The user is identified by their email address
        return self.email

    def get_short_name(self):
        # The user is identified by their email address
        return self.username

    # On Python 3: def __str__(self):
    def __unicode__(self):
        return self.email

    # def has_perm(self, perm, obj=None):
    #     if self.is_active and self.is_superuser:
    #         return True
    #
    #     for backend in auth.get_backends():
    #         if not hasattr(backend, 'has_perm'):
    #             continue
    #         try:
    #             if backend.has_perm(self, perm, obj):
    #                 return True
    #         except PermissionDenied:
    #             return False
    #     return False
    #
    # def has_module_perms(self, app_label):
    #     if self.is_active and self.is_superuser:
    #         return True
    #     for backend in auth.get_backends():
    #         if not hasattr(backend, 'has_module_perms'):
    #             continue
    #         try:
    #             if backend.has_module_perms(self, app_label):
    #                 return True
    #         except PermissionDenied:
    #             return False
    #     return False

    @property
    def is_staff(self):
        """Is the user a member of staff?"""
        # Simplest possible answer: All admins are staff
        return self.is_admin

    class Meta:
        verbose_name_plural = verbose_name = u'用户'

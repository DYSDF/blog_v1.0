from __future__ import unicode_literals

from django import forms
from django.conf import settings
from django.db import models
from django.contrib.sites.models import Site
from django.contrib import admin
from django.urls import get_script_prefix
from django.utils.encoding import iri_to_uri, python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _, ugettext


@python_2_unicode_compatible
class FlatPage(models.Model):
    url = models.CharField(_('URL'), max_length=100, db_index=True)
    title = models.CharField(_('title'), max_length=200)
    content = models.TextField(_('content'), blank=True)
    enable_comments = models.BooleanField(_('enable comments'), default=False)
    template_name = models.CharField(_('template name'), max_length=70, blank=True, help_text=_(
        "Example: 'flatpages/contact_page.html'. If this isn't provided, "
        "the system will use 'flatpages/default.html'."
    ),
                                     )
    registration_required = models.BooleanField(_('registration required'), help_text=_(
        "If this is checked, only logged-in users will be able to view the page."),
                                                default=False,
                                                )
    sites = models.ManyToManyField(Site, verbose_name=_('sites'))

    class Meta:
        # db_table = 'django_flatpage'
        verbose_name = _('flat page')
        verbose_name_plural = _('flat pages')
        ordering = ('url',)

    def __str__(self):
        return "%s -- %s" % (self.url, self.title)

    def get_absolute_url(self):
        # Handle script prefix manually because we bypass reverse()
        return iri_to_uri(get_script_prefix().rstrip('/') + self.url)


class FlatpageForm(forms.ModelForm):
    url = forms.RegexField(label=_("URL"), max_length=100, regex=r'^[-\w/\.~]+$',
                           help_text=_("Example: '/about/contact/'. Make sure to have leading and trailing slashes."),
                           error_messages={
                               "invalid": _(
                                   "This value must contain only letters, numbers, dots, "
                                   "underscores, dashes, slashes or tildes."
                               ),
                           },
                           )

    class Meta:
        model = FlatPage
        fields = '__all__'

    def clean_url(self):
        url = self.cleaned_data['url']
        if not url.startswith('/'):
            raise forms.ValidationError(
                ugettext("URL is missing a leading slash."),
                code='missing_leading_slash',
            )
        if (settings.APPEND_SLASH and (
                    (settings.MIDDLEWARE and 'django.middleware.common.CommonMiddleware' in settings.MIDDLEWARE) or
                        'django.middleware.common.CommonMiddleware' in settings.MIDDLEWARE_CLASSES) and
                not url.endswith('/')):
            raise forms.ValidationError(
                ugettext("URL is missing a trailing slash."),
                code='missing_trailing_slash',
            )
        return url

    def clean(self):
        url = self.cleaned_data.get('url')
        sites = self.cleaned_data.get('sites')

        same_url = FlatPage.objects.filter(url=url)
        if self.instance.pk:
            same_url = same_url.exclude(pk=self.instance.pk)

        if sites and same_url.filter(sites__in=sites).exists():
            for site in sites:
                if same_url.filter(sites=site).exists():
                    raise forms.ValidationError(
                        _('Flatpage with url %(url)s already exists for site %(site)s'),
                        code='duplicate_url',
                        params={'url': url, 'site': site},
                    )

        return super(FlatpageForm, self).clean()


class FlatPageAdmin(admin.ModelAdmin):
    form = FlatpageForm
    fieldsets = (
        (None, {'fields': ('url', 'title', 'content', 'enable_comments', 'sites')}),
        (_('Advanced options'), {
            'classes': ('collapse',),
            'fields': ('registration_required', 'template_name'),
        }),
    )
    list_display = ('url', 'title')
    list_filter = ('sites', 'registration_required')
    search_fields = ('url', 'title')

    class Media:
        js = (
            'ckeditor/ckeditor.js',
            'ckeditor/simplePage_config.js'
        )


admin.site.register(FlatPage, FlatPageAdmin)

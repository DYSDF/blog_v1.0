# coding: utf-8
from django.db.models import Count
from django.template import loader
from django.core.cache import cache
from django.contrib.sites.shortcuts import get_current_site
from blog.models import Cats, Tags, Comment, Settings

from siteRoot import settings


def get_base_context(request, **kwargs):
    site_id = get_current_site(request).id
    site_settings = Settings.objects.filter(sites__id=site_id)

    nav_menu = cache.get("nav_menu_" + str(site_id))
    if nav_menu is None or len(nav_menu) == 0:
        nav_menu = []
        if len(site_settings) > 0:
            nav_menu = site_settings[0].nav_menu.all()
            cache.set("nav_menu_" + str(site_id), nav_menu, 24 * 60 * 60)

    head_image = cache.get("head_image_" + str(site_id))
    if head_image is None or head_image == "":
        if len(site_settings) > 0:
            head_image_obj = site_settings[0].head_img
            if head_image_obj.name != "":
                head_image = head_image_obj.url
                cache.set("head_image_" + str(site_id), head_image, 24 * 60 * 60)

    return {
        # 基础部分
        'result': None,
        "page": 1,
        "rows": 10,
        'paginator': None,
        'prev': None,
        'next': None,
        'current_url': "/",  # 当前页面URL

        # 公共部分
        "cat_model": get_cats_info(request.user),  # 所有归档标签数据
        "tag_model": get_tags_info(request.user),  # 所有标签数据
        "comments_model": get_comments_info(request.user)[:10],  # 所有评论数据
        'nav_menu': nav_menu,
        "head_image": head_image
    }


def get_base_result(request, **kwargs):
    result = {
        'success': False,
        'msg': "",
    }
    return result


def get_cats_info(user):
    cats_info = cache.get("cats_info")
    if cats_info is None:
        cats_info = Cats.objects.accessible(user).annotate(count=Count("post")).order_by("-count", "cat")
        cache.set("cats_info", cats_info, 12 * 60 * 60)
    return cats_info


def get_tags_info(user):
    tags_info = cache.get("tags_info")
    if tags_info is None:
        tags_info = Tags.objects.accessible(user).annotate(count=Count("post")).order_by("-count", "tag")
        cache.set("tags_info", tags_info, 12 * 60 * 60)
    return tags_info


def get_comments_info(user):
    return Comment.objects.accessible(user).order_by("-date")


# 迭代渲染楼中楼评论结构
def _comments_tree(comment_list, first=True):
    result = ""
    for c in comment_list:
        if first and c.reply_to is not None:
            continue
        if len(c.reply.all()) > 0:
            result = loader.render_to_string("blog/model/comment_tree.html", {
                "brother": result,
                "comment": c,
                "children": _comments_tree(c.reply.all(), False)
            })
        else:
            result = loader.render_to_string("blog/model/comment_tree.html", {
                "brother": result,
                "comment": c
            })
    return result


def get_comments_tree(request, **kwargs):
    return _comments_tree(kwargs["comment_list"])

# encoding: utf-8

import json

import time
from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie

from django.core.cache import cache

from libs.Netease.Netease_api import NetEase

music = NetEase()

from django.template.loader import get_template


@ensure_csrf_cookie
def index(request):
    return render_to_response("music/index.html", context=RequestContext(request))


# 获取榜单列表
@ensure_csrf_cookie
def getPlayList(request):
    # 防止外站引用
    if request.method == "GET":
        raise Http404

    if "timestamp" not in request.POST or int(time.time()) - int(request.POST["timestamp"]) > 10000:
        raise Http404

    playlist = cache.get("music_play_list")
    if playlist is None:
        playlist = music.return_toplists()
        cache.set("music_play_list", playlist, 24 * 60 * 60)
    return HttpResponse(json.dumps(playlist), content_type="application/json")


# 获取榜单内的歌曲，需要传递榜单id值
def getTopList(request):
    if "playlistId" not in request.POST:
        raise Http404
    playlistId = request.POST["playlistId"]

    toplist = cache.get("music_top_list_" + playlistId)
    if toplist is None:
        toplist = music.top_songlist(int(playlistId))
        cache.set("music_top_list_" + playlistId, toplist, 24 * 60 * 60)
    return HttpResponse(json.dumps(toplist), content_type="application/json")


def getSongLyric(request):
    if "songId" not in request.POST:
        raise Http404
    musicId = request.POST["songId"]

    lrc = cache.get("music_lrc_" + musicId)
    if lrc is None:
        lrc = music.song_lyric(musicId)
        cache.set("music_lrc_" + musicId, lrc, 24 * 60 * 60)
    return HttpResponse(json.dumps(lrc), content_type="application/json")

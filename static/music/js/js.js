// JavaScript Document
// 界面滚动文字
require(["ScrollText"], function (ScrollText) {
    [].forEach.call(document.getElementsByClassName("scroll_text"), function (el) {
        ScrollText(el);
    }.bind(this))
});

// 内容面板自适应
(function () {
    function setContentHeight() {
        document.getElementById("content").style.height = document.documentElement.offsetHeight - 50 + "px";
    }

    window.addEventListener("resize", setContentHeight);
    setContentHeight();
})();

// 控制面板显示控制
require(["DYUtils"], function (DYUtils) {
    var target = document.getElementById("content"),
        maxHeight = document.documentElement.offsetHeight - 50,
        minHeight = maxHeight - 60,
        isDraging,
        isValid,
        startPosition,
        stepX,
        stepY,
        curPanelHeight;

    function setControlPanelHeight(offsetY) {
        var targetHeight = curPanelHeight + offsetY;
        targetHeight = targetHeight > maxHeight ? maxHeight : (targetHeight < minHeight ? minHeight : targetHeight);
        target.style.height = targetHeight + "px";
    }

    function resetControlPanelHeight() {
        curPanelHeight = target.offsetHeight;
        if (maxHeight + minHeight > curPanelHeight * 2) {
            setControlPanelHeight(minHeight - curPanelHeight - 1);
        } else {
            setControlPanelHeight(maxHeight - target.offsetHeight + 1);
        }
    }

    DYUtils.bindEvent(document, "mousedown", function (e) {
        isDraging = true;
        e = e || window.event;
        startPosition = {
            x: e.clientX,
            y: e.clientY
        };
        curPanelHeight = target.offsetHeight;
    });
    DYUtils.bindEvent(document, "mousemove", function (e) {
        if (!isDraging) return;
        e = e || window.event;
        if (isValid) {
            target.style.transition = "height 0ms ease-in-out";
            setControlPanelHeight((e.clientY - startPosition.y) / 2);
        } else {
            stepX = e.clientX - startPosition.x;
            stepY = e.clientY - startPosition.y;
            if (Math.abs(stepX) < 10 && Math.abs(stepY) < 10) return;
            Math.abs(stepX) > Math.abs(stepY) ? (isValid = false) : (isValid = true);
        }
    });
    DYUtils.bindEvent(document, "mouseup", function (e) {
        isValid = false;
        isDraging = false;
        target.style.transition = "";
        resetControlPanelHeight();
    });
    DYUtils.bindEvent(window, "resize", DYUtils.debounce(function (e) {
        maxHeight = document.documentElement.offsetHeight - 50;
        minHeight = maxHeight - 60;
    }, 1000))
});

// 歌曲列表面板显示控制
require(["DYUtils"], function (DYUtils) {
    var songPanel = document.getElementById("songPanel"),
        songPanelBtn = document.getElementById("listopen"),
        maxOffsetX = 1,
        minOffsetX = 0,
        regexp = /matrix\(((\d+\.?\d*),\s){5}\d+\.?\d*\)/,
        isDraging,
        isValid,
        startPosition,
        stepX,
        stepY,
        curTransform;

    function isPanelOpen() {
        return DYUtils.hasClassName(songPanel, "open");
    }

    function setSongPanelTransform(offsetX) {
        var targetOffsetX = (curTransform + offsetX) / songPanel.offsetWidth;
        targetOffsetX = targetOffsetX > maxOffsetX ? maxOffsetX : (targetOffsetX < minOffsetX ? minOffsetX : targetOffsetX);
        songPanel.style.transform = "translate3d(" + targetOffsetX * 100 + "%, 0, 0)";
    }

    function showSongPanel() {
        if (!isPanelOpen()) {
            DYUtils.addClassName(songPanel, "open");
            DYUtils.addClassName(songPanelBtn, "openlist");

            DYUtils.removeEvent(document, "mouseup", hideSongPanel);
            DYUtils.oneEvent(document, "mouseup", hideSongPanel);
        }
    }

    function hideSongPanel() {
        if (isPanelOpen()) {
            DYUtils.removeClassName(songPanel, "open");
            DYUtils.removeClassName(songPanelBtn, "openlist");
        }

    }

    function toggleSongPanel() {
        if (isPanelOpen()) {
            hideSongPanel();
        } else {
            showSongPanel();
        }
    }

    function resetSongPanel() {
        if (Number(DYUtils.getCssValue(songPanel, "transform").match(regexp)[2]) / songPanel.offsetWidth > 0.5) {
            hideSongPanel();
        } else {
            showSongPanel();
        }
        songPanel.style.transform = "";
    }

    DYUtils.bindEvent(document, "mousedown touchstart", function (e) {
        isDraging = true;
        console.log(e);
        e = e.touches ? e.touches[0] : (e || window.event);
        startPosition = {
            x: e.clientX,
            y: e.clientY
        };
        curTransform = Number(DYUtils.getCssValue(songPanel, "transform").match(regexp)[2]);
        hideSongPanel();
    });
    DYUtils.bindEvent(document, "mousemove touchmove", function (e) {
        if (!isDraging) return;
        e = e.touches ? e.touches[0] : (e || window.event);
        if (isValid) {
            songPanel.style.transition = "all 0ms linear";
            setSongPanelTransform((e.clientX - startPosition.x) / 1.2);
        } else {
            stepX = e.clientX - startPosition.x;
            stepY = e.clientY - startPosition.y;
            if (Math.abs(stepX) < 10 && Math.abs(stepY) < 10) return;
            Math.abs(stepX) < Math.abs(stepY) ? (isValid = false) : (isValid = true);
        }
    });
    DYUtils.bindEvent(document, "mouseup touchend", function (e) {
        if (isValid) {
            isValid = false;
            resetSongPanel();
        }
        songPanel.style.transition = "";
        isDraging = false;
    });
    DYUtils.bindEvent(songPanelBtn, "mousedown", function (e) {
        e.stopPropagation();
    });
    DYUtils.bindEvent(songPanelBtn, "mouseup", function (e) {
        e.stopPropagation();
        toggleSongPanel();
    });
    DYUtils.bindEvent(songPanel, "mousedown touchstart", function (e) {
        e.stopPropagation();
    })
});

// 音乐播放控制
require(["DYUtils", "SimpleMusicPlayer", "ScrollText"], function (DYUtils, SimpleMusicPlayer, ScrollText) {
    var MusicPlayer = new SimpleMusicPlayer();

    var songList = [];
    var songIndex = 0;
    var playList = {};
    var playIndex = 0;

    var lyricData;
    var lyricOffset;

    // 生成歌曲列表DOM
    function renderPlayListPanel(songListId) {
        var playListEl = document.createElement("ol");
        var childStr = "";

        // 返回按钮
        childStr += "<div id='back'>返回上一层</div>";

        // 歌曲列表DOM
        playList[songListId].forEach(function (item, index, array) {
            childStr += "<li data-id=\"" + index + "\" data-songIndex='" + songListId + "' class='play_list_li'><div class=\"musicName\">" + item.name + "</div><div class=\"musicTime\">" + formatTime(item.duration / 1000) + "</div></li>";
        });
        playListEl.innerHTML = childStr;

        document.getElementById("songlist").innerHTML = playListEl.outerHTML;

        DYUtils.addClassName(document.getElementById("songContainer"), "open");

        if (songIndex == songListId) hightCurPlayList();
    }

    // 获取歌单歌曲列表JSON
    function getPlayListJSON(id) {
        if (!playList[id] || playList[id].length === 0) {
            var localPlayList = DYUtils.toObject(DYUtils.getLocalStorage("playList"));
            var localUpdateTime = DYUtils.getLocalStorage("playListUpdateTime") * 1;
            var nowTime = new Date().getDate();
            if (!localPlayList || !localPlayList[id] || localPlayList[id].length === 0 || localUpdateTime < nowTime) {
                DYUtils.ajax({
                    url: "/music/toplist",
                    method: "POST",
                    data: {
                        "playlistId": id,
                        "timestamp": new Date().getTime()
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-CSRFToken", DYUtils.getCookie("csrftoken"));
                    },
                    success: function (data) {
                        playList[id] = JSON.parse(data);
                        DYUtils.setLocalStorage("playList", JSON.stringify(playList));
                        DYUtils.setLocalStorage("playListUpdateTime", new Date().getDate());
                        renderPlayListPanel(id);
                    },
                    error: function () {
                        alert("获取歌曲列表失败")
                    }
                })
            } else {
                playList = localPlayList;
                renderPlayListPanel(id);
            }
        } else {
            renderPlayListPanel(id);
        }
    }

    // 生成歌单列表DOM
    function renderSongListPanel() {
        var olEl = document.createElement("ol");
        var childStr = "";
        for (var i in songList) {
            childStr += "<li class='song_list_li' data-id=\"" + songList[i].id + "\"><div class=\"playlistName\">《" + songList[i].name + "》</div></li>";
        }
        olEl.innerHTML = childStr;
        document.getElementById("playlist").innerHTML = olEl.outerHTML;
    }

    // 获取歌单JSON
    function getSongListJson() {
        var localSongList = DYUtils.toObject(DYUtils.getLocalStorage("songList")),
            localUpdateTime = DYUtils.getLocalStorage("songListUpdateTime") * 1,
            nowTime = new Date().getDate();
        if (!localSongList || localSongList.length === 0 || localUpdateTime < nowTime) {
            DYUtils.ajax({
                url: "/music/playlist",
                method: "POST",
                data: {"timestamp": new Date().getTime()},
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRFToken", DYUtils.getCookie("csrftoken"));
                },
                success: function (data) {
                    songList = JSON.parse(data);
                    renderSongListPanel();
                    DYUtils.setLocalStorage("songList", JSON.stringify(data));
                    DYUtils.setLocalStorage("songListUpdateTime", nowTime);
                },
                error: function () {
                    alert("获取歌单列表失败");
                }
            });
        } else {
            songList = localSongList;
            renderSongListPanel();
        }
    }

    // 获取歌词
    function getLyricJson(fn) {
        var id = playList[songIndex][playIndex].id;
        DYUtils.ajax({
            url: "/music/getLyric",
            method: "POST",
            data: {"songId": id},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", DYUtils.getCookie("csrftoken"));
            },
            success: function (data) {
                var json = JSON.parse(data);
                if (fn) fn(parseLyric(json));
            },
            error: function () {
                lyricData = {0: "暂无歌词"}
            }
        })
    }

    // 歌词解析器
    function parseLyric(lrc) {
        var lrcObj = {};
        try {
            var lyrics = lrc.split("\n");
            for (var i = 0; i < lyrics.length; i++) {
                var lyric = decodeURIComponent(lyrics[i]);
                var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
                var timeRegExpArr = lyric.match(timeReg);
                if (!timeRegExpArr) continue;
                var clause = lyric.replace(timeReg, "");
                if (clause == "" || clause == undefined) continue; // 去除空白行
                for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
                    var t = timeRegExpArr[k];
                    var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                        sec = Number(String(t.match(/\:\d*/i)).slice(1));
                    var time = min * 60 + sec;
                    lrcObj[time] = clause;
                }
            }
        } catch (e) {
            lrcObj = {0: "暂无歌词"};
        }
        return lrcObj;
    }

    // 歌词渲染
    function renderLyricDOM(lrcObj) {
        var lrcEl = document.createElement("ul"),
            stepOffset;

        var childStr = "";
        for (var key in lrcObj) {
            childStr += "<li id='lrc_time_" + key + "' class='lrc_content'>" + lrcObj[key] + "</li>";
        }
        lrcEl.innerHTML = childStr;
        document.getElementById("songlrc").innerHTML = lrcEl.outerHTML;

        [].slice.call(document.getElementsByClassName("lrc_content")).forEach(function (item) {
            ScrollText(item);
        });

        stepOffset = document.querySelector("#songlrc ul").offsetHeight / Object.keys(lrcObj).length;
        lyricOffset = {};
        var keys = Object.keys(lrcObj);
        for (var i = 0; i < keys.length; i++) {
            lyricOffset[keys[i]] = i * stepOffset;
        }
    }

    // 歌词滚动
    function scrollLyricDOM(time) {
        try {
            var offsetTop = lyricOffset[time];
            if (offsetTop) {
                document.querySelector("#songlrc ul").style.transform = "translate3d(0," + -offsetTop + "px,0)";
                DYUtils.removeClassName(document.getElementsByClassName("lrc_content"), "on");
                DYUtils.addClassName(document.getElementById("lrc_time_" + time), "on");
            }
        } catch (e) {
        }
    }

    function hightCurSongList() {
        [].slice.call(document.getElementsByClassName("song_list_li")).forEach(function (item) {
            if (item.dataset["id"] == songIndex) {
                DYUtils.addClassName(item, "cur");
            } else {
                DYUtils.removeClassName(item, "cur");
            }
        });
    }

    function hightCurPlayList() {
        [].slice.call(document.getElementsByClassName("play_list_li")).forEach(function (item) {
            if (item.dataset["id"] == playIndex) {
                DYUtils.addClassName(item, "cur");
            } else {
                DYUtils.removeClassName(item, "cur");
            }
        })
    }

    getSongListJson();

    // 监听事件
    // 监听点击歌单获取歌单详情
    DYUtils.bindEvent(document.getElementById("playlist"), "click", function (e) {
        e = e || window.event;
        var target = e.target;
        [].slice.call(document.getElementsByClassName("song_list_li")).forEach(function (item, index, array) {
            if (DYUtils.isChildNode(target, item)) {
                getPlayListJSON(item.dataset["id"]);
            }
        });
    });

    // 监听歌曲列表返回事件
    DYUtils.bindEvent(document.getElementById("songlist"), "click", function (e) {
        e = e || window.event;
        var target = e.target;
        if (DYUtils.isChildNode(target, document.getElementById("back"))) {
            DYUtils.removeClassName(document.getElementById("songContainer"), "open");
        }
    });

    // 监听点击单曲事件
    DYUtils.bindEvent(document.getElementById("songlist"), "click", function (e) {
        e = e || window.event;
        var target = e.target;
        [].slice.call(document.getElementsByClassName("play_list_li")).forEach(function (item, index, array) {
            if (DYUtils.isChildNode(target, item)) {
                songIndex = item.dataset["songindex"];
                playIndex = item.dataset["id"];
                MusicPlayer.setSongList(playList[songIndex]);
                MusicPlayer.play(playIndex);
                hightCurSongList();
                hightCurPlayList();
            }
        });
    });

    // 监听点击播放事件
    DYUtils.bindEvent(document.getElementById("control_play"), "click", function () {
        if (MusicPlayer.isPaused()) {
            MusicPlayer.play();
        } else {
            MusicPlayer.pause();
        }
    });

    // 监听上、下一曲事件
    DYUtils.bindEvent(document.getElementById("control_prev"), "click", function () {
        MusicPlayer.prev()
    });
    DYUtils.bindEvent(document.getElementById("control_next"), "click", function () {
        MusicPlayer.next()
    });

    // 监听音量点击事件
    DYUtils.bindEvent(document.getElementById("control_vol"), "click", function () {
        MusicPlayer.mute();
    });
    DYUtils.bindEvent(document.getElementById("control_vol"), "mousewheel DOMMouseScroll", function (e) {
        e = e || window.event;
        var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) || (e.detail && (e.detail > 0 ? -1 : 1));
        if (delta > 0) {
            //向上滚动
            MusicPlayer.volPlus();
        } else {
            MusicPlayer.volSub();
        }
    });


    // 监听播放器事件
    MusicPlayer.listener("play", function () {
        DYUtils.addClassName(document.getElementById("control_play"), "control_pause");
        DYUtils.removeClassName(document.getElementById("control_ablum"), "rotate_stop");
    });
    MusicPlayer.listener("pause", function () {
        DYUtils.removeClassName(document.getElementById("control_play"), "control_pause");
        DYUtils.addClassName(document.getElementById("control_ablum"), "rotate_stop");
    });
    MusicPlayer.listener("timeupdate", function () {
        document.getElementById("durCurTime").innerHTML = formatTime(this.currentTime);
    });
    MusicPlayer.listener("timeupdate", function () {
        document.querySelector("#durprogress .progress").style.width = this.currentTime / this.duration * 100 + "%";
    });
    MusicPlayer.listener("timeupdate", function () {
        var curTime = Math.floor(this.currentTime);
        scrollLyricDOM(curTime);
    });
    MusicPlayer.listener("change", function (index) {
        playIndex = index;
        hightCurPlayList();
    });
    // 设置封面、专辑、歌手等各类信息
    MusicPlayer.listener("canplay", function () {
        getLyricJson(function (lrcData) {
            lyricData = lrcData;
            renderLyricDOM(lrcData);
        });
    });
    MusicPlayer.listener("canplay", function () {
        document.getElementById("durTolTime").innerHTML = formatTime(this.duration);
    });
    MusicPlayer.listener("canplay", function () {
        var songInfo = playList[songIndex][playIndex];
        if (songInfo) {
            var title = songInfo.name,
                artists = songInfo.artists,
                album = songInfo.album.name;
            document.getElementById("music_name").innerHTML = " 《" + title + "》 ";
            document.querySelector("#music_ablum span").innerHTML = album;
            document.querySelector("#music_art span").innerHTML = artists.map(function (item) {
                return item.name;
            }).join("/");

            document.querySelector("#control_ablum").style.backgroundImage = "url(" + songInfo.album.picUrl + ")";
            document.querySelector("#blur_img").style.backgroundImage = "url(" + songInfo.album.blurPicUrl + ")";
        }
    });
    MusicPlayer.listener("volumechange", function () {
        if (this.muted) {
            DYUtils.addClassName(document.getElementById("control_vol"), "muted");
        } else {
            DYUtils.removeClassName(document.getElementById("control_vol"), "muted");
        }
    });
    MusicPlayer.listener("volumechange", function () {
        document.getElementById("control_vol").dataset.vol = parseInt(this.volume * 100);
    });

    // 阻止默认事件
    DYUtils.bindEvent(document.getElementById("songContainer"), "mouseup", function (e) {
        e = e || window.event;
        DYUtils.stopBubble(e);
    })
});

// 歌曲时间格式化
function formatTime(t) {
    return [parseInt(t / 60), Math.round(t % 60)].join(":").replace(/\b(\d)\b/g, "0$1")
}

// 获取范围随机整数
function getRandom(a, b) {
    var index = Math.min(a, b);  //获取范围偏移
    var rang = Math.max(a, b) - Math.min(a, b);  //获取范围区间
    return Math.floor(Math.random() * (rang + 1)) + index;
}